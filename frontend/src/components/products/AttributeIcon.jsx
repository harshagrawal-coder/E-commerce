import { Palette, Ruler, HardDrive, MemoryStick, Layers, Battery, Tag, MonitorSmartphone, Truck, Cpu } from "lucide-react";

const attributeIcons = {
  color: Palette,
  size: Ruler,
  storage: HardDrive,
  ram: MemoryStick,
  memory: MemoryStick,
  material: Layers,
  fabric: Layers,
  battery: Battery,
  brand: Tag,
  screen: MonitorSmartphone,
  display: MonitorSmartphone,
  resolution: MonitorSmartphone,
  processor: Cpu,
  variant: Tag,
  processorBrand: Cpu,
  chipset: Cpu,
  connectivity: Truck,
};

function AttributeIcon({ name, size = 13, strokeWidth = 2, className = "" }) {
  const key = String(name || "").toLowerCase();
  for (const [k, Icon] of Object.entries(attributeIcons)) {
    if (key.includes(k)) return <Icon size={size} strokeWidth={strokeWidth} className={className} />;
  }
  return <Tag size={size} strokeWidth={strokeWidth} className={className} />;
}

export default AttributeIcon;
