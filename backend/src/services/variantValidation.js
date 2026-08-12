import SubCategory from "../models/subCategory.model.js";
import Attribute from "../models/attrubutes.model.js";
import AttributeValue from "../models/attributesValue.model.js";

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

const toId = (value) => value?.toString?.() ?? value;

export const getSubCategoryConfig = async (subCategoryId) => {
  return SubCategory.findById(subCategoryId)
    .populate({
      path: "allowedAttributes.attribute",
      model: Attribute,
    })
    .populate({
      path: "allowedAttributes.allowedValues",
      model: AttributeValue,
    });
};

const getConfigMap = (subCategory) => {
  const map = new Map();
  for (const config of subCategory.allowedAttributes || []) {
    if (config.attribute) {
      map.set(config.attribute._id.toString(), config);
    }
  }
  return map;
};

const getAttributeName = (config) =>
  config.attribute?.name || config.attribute?._id || "Unknown";

export const validateVariantAgainstSubCategory = async ({
  subCategoryId,
  attributes,
  sku = "",
}) => {
  const subCategory = await getSubCategoryConfig(subCategoryId);
  if (!subCategory) {
    throw new ValidationError("Sub-category not found");
  }

  const configMap = getConfigMap(subCategory);
  const requiredConfigs = (subCategory.allowedAttributes || []).filter(
    (config) => config.required && config.allowedValues?.length,
  );

  const seen = new Set();
  const list = Array.isArray(attributes) ? attributes : [];

  for (const attr of list) {
    const attrId = toId(attr.attribute);
    const valueId = toId(attr.value);

    if (!attrId || !valueId) {
      throw new ValidationError(
        `Attribute and value are required for variant ${sku}`,
      );
    }
    if (seen.has(attrId)) {
      throw new ValidationError(`Duplicate attribute in variant ${sku}`);
    }
    seen.add(attrId);

    const config = configMap.get(attrId);
    if (!config) {
      throw new ValidationError(
        `Attribute ${attrId} is not configured for this sub-category`,
      );
    }

    const allowedValue = (config.allowedValues || []).find(
      (value) => value._id.toString() === valueId,
    );
    if (!allowedValue) {
      throw new ValidationError(
        `Value is not allowed for attribute "${getAttributeName(config)}" in this sub-category`,
      );
    }
  }

  for (const config of requiredConfigs) {
    if (!seen.has(config.attribute._id.toString())) {
      throw new ValidationError(
        `Missing required attribute "${getAttributeName(config)}" for variant ${sku}`,
      );
    }
  }
};
