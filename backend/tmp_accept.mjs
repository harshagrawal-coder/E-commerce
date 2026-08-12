import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { config } from "./src/config/config.js";
import User from "./src/models/user.model.js";
import Attribute from "./src/models/attrubutes.model.js";
import AttributeValue from "./src/models/attributesValue.model.js";

await mongoose.connect(config.MONGO_URI);

const admin = await User.findOne({ role: "admin" });
const token = jwt.sign(
  { id: admin._id, email: admin.email, role: admin.role },
  config.JWT_SECRET,
  { expiresIn: "7d" }
);
await mongoose.disconnect();

const BASE = "http://localhost:5000/api";
const iphoneId = "6a7be1786a0ac3b34f1e0ad7";
const colorBlack = "6a72fad8fc1c7788fbd430dd";
const colorNeela = "6a7abbc2d8bf6c2d8ea86f5c";
const ram256 = "6a7c00926a0ac3b34f1e0c95";
const sizeL = "6a72f791b36046171616d6e5";

let failures = 0;
const check = (name, ok, detail) => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` :: ${detail}` : ""}`);
  if (!ok) failures++;
};

const call = async (method, path, body, extraHeaders = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let json = null;
  try {
    json = await res.json();
  } catch {}
  return { status: res.status, json };
};

const createdVariants = [];

// 1. Valid variant (color black + ram 256) -> 201
{
  const { status, json } = await call("POST", `/variant/product/${iphoneId}`, {
    sku: `TEST-IP17-B-256`,
    price: 999,
    stock: 5,
    attributes: [
      { attribute: "6a72e4b0374a736193a1badc", value: colorBlack },
      { attribute: "6a79f0e0ab4502bf65dd394d", value: ram256 },
    ],
    isDefault: true,
    isActive: true,
  });
  check("create valid variant -> 201", status === 201, `status=${status}`);
  if (status === 201) {
    createdVariants.push(json.data._id);
  }
}

// 2. Missing required variant attribute (ram omitted) -> 400
{
  const { status, json } = await call("POST", `/variant/product/${iphoneId}`, {
    sku: "TEST-IP17-B",
    price: 999,
    stock: 5,
    attributes: [{ attribute: "6a72e4b0374a736193a1badc", value: colorBlack }],
  });
  check(
    "missing required variant attr -> 400",
    status === 400 && /Missing required variant attribute/.test(json?.message || ""),
    `status=${status} message=${json?.message}`
  );
}

// 3. Unconfigured attribute (size) -> 400
{
  const { status, json } = await call("POST", `/variant/product/${iphoneId}`, {
    sku: "TEST-IP17-L",
    price: 999,
    stock: 5,
    attributes: [
      { attribute: "6a72e4b9374a736193a1badd", value: sizeL },
      { attribute: "6a79f0e0ab4502bf65dd394d", value: ram256 },
    ],
  });
  check(
    "unconfigured attribute -> 400",
    status === 400 && /not configured/.test(json?.message || ""),
    `status=${status} message=${json?.message}`
  );
}

// 4. Value not allowed for configured attribute -> 400
{
  const { status, json } = await call("POST", `/variant/product/${iphoneId}`, {
    sku: "TEST-IP17-NEELA",
    price: 999,
    stock: 5,
    attributes: [
      { attribute: "6a72e4b0374a736193a1badc", value: colorNeela },
      { attribute: "6a79f0e0ab4502bf65dd394d", value: ram256 },
    ],
  });
  check(
    "value not allowed -> 400",
    status === 400 && /not allowed/.test(json?.message || ""),
    `status=${status} message=${json?.message}`
  );
}

// 5. Empty attributes (required variant attrs missing) -> 400
{
  const { status, json } = await call("POST", `/variant/product/${iphoneId}`, {
    sku: "TEST-IP17-NOATTR",
    price: 999,
    stock: 5,
    attributes: [],
  });
  check(
    "empty attributes -> 400",
    status === 400,
    `status=${status} message=${json?.message}`
  );
}

// 6. Cleanup created variants
for (const id of createdVariants) {
  const { status } = await call("DELETE", `/variant/product/${iphoneId}/${id}`);
  check("cleanup created variant", status === 200, `status=${status}`);
}

// 7. Harden: duplicate allowedValues rejected on subcategory update
{
  const { status, json } = await call(
    "PUT",
    `/subcategory/6a77041d03dd5e49e27d5ad2`,
    {
      allowedAttributes: [
        {
          attribute: "6a72e4b0374a736193a1badc",
          allowedValues: [colorBlack, colorBlack],
          required: true,
          isVariant: true,
        },
      ],
    }
  );
  check(
    "duplicate allowedValues rejected",
    status >= 400 && /Duplicate values/.test(json?.message || ""),
    `status=${status} message=${json?.message}`
  );
}

// ============ Acceptance data configuration ============
const sizeAttr = "6a72e4b9374a736193a1badd";
const colorAttr = "6a72e4b0374a736193a1badc";
const sizeValues = ["6a72f791b36046171616d6e5", "6a72f8dffc1c7788fbd430da", "6a72f8e9fc1c7788fbd430db"];
const colorValues = [colorBlack, "6a72fad0fc1c7788fbd430dc", "6a72faf7fc1c7788fbd430df"];
const mobileId = "6a77041d03dd5e49e27d5ad2";
const shirtsId = "6a799ba3e9d9229ba2fcd211";
const jeansId = "6a799e380ba0133cac9ac096";

// Ensure storage attribute + values exist
let storageAttr = await Attribute.findOne({ slug: "storage" });
if (!storageAttr) {
  const r = await fetch(`${BASE}/attribute`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ name: "storage", inputType: "select" }),
  });
  storageAttr = await r.json();
  storageAttr = storageAttr.data;
  console.log("created storage attribute:", storageAttr._id);
}
const storageValues = [];
for (const v of ["128", "256", "512"]) {
  const existing = await AttributeValue.findOne({ attribute: storageAttr._id, value: v });
  if (existing) {
    storageValues.push(existing._id);
    continue;
  }
  const r = await fetch(`${BASE}/attribute-value`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ attribute: storageAttr._id, value: v }),
  });
  const j = await r.json();
  if (j.data) storageValues.push(j.data._id);
}
console.log("storage values:", storageValues);

const configs = [
  {
    id: mobileId,
    allowedAttributes: [
      { attribute: colorAttr, allowedValues: colorValues, required: true, isVariant: true, isFilterable: true, isVisible: true, displayOrder: 0 },
      { attribute: storageAttr._id, allowedValues: storageValues, required: true, isVariant: true, isFilterable: true, isVisible: true, displayOrder: 1 },
      { attribute: "6a79f0e0ab4502bf65dd394d", allowedValues: [ram256], required: true, isVariant: true, isFilterable: true, isVisible: true, displayOrder: 2 },
    ],
  },
  {
    id: shirtsId,
    allowedAttributes: [
      { attribute: sizeAttr, allowedValues: sizeValues, required: true, isVariant: true, isFilterable: true, isVisible: true, displayOrder: 0 },
      { attribute: colorAttr, allowedValues: colorValues, required: false, isVariant: true, isFilterable: true, isVisible: true, displayOrder: 1 },
    ],
  },
  {
    id: jeansId,
    allowedAttributes: [
      { attribute: sizeAttr, allowedValues: sizeValues, required: true, isVariant: true, isFilterable: true, isVisible: true, displayOrder: 0 },
      { attribute: colorAttr, allowedValues: colorValues, required: false, isVariant: true, isFilterable: true, isVisible: true, displayOrder: 1 },
    ],
  },
];

for (const c of configs) {
  const { status, json } = await call("PUT", `/subcategory/${c.id}`, {
    allowedAttributes: c.allowedAttributes,
  });
  check(`configure ${c.id}`, status === 200, `status=${status} message=${json?.message}`);
}

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
