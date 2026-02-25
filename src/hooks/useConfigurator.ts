import { useState, useMemo } from "react";

const TOILE_COLORS = [
  { name: "Blanc Écru", hex: "#F5F0E8" },
  { name: "Sable", hex: "#E8DCC8" },
  { name: "Chanvre", hex: "#C8B89A" },
  { name: "Havane", hex: "#8B7355" },
  { name: "Moka", hex: "#5C4A32" },
  { name: "Sauge", hex: "#4A5E3A" },
  { name: "Eucalyptus", hex: "#6B8C6B" },
  { name: "Bleu Ardoise", hex: "#4A6B8A" },
  { name: "Terracotta", hex: "#8A4A4A" },
  { name: "Gris Clair", hex: "#C8C8C8" },
  { name: "Gris Anthracite", hex: "#5A5A5A" },
  { name: "Noir", hex: "#1A1A1A" },
];

const ARMATURE_COLORS = [
  { name: "Blanc RAL 9016", hex: "#F0EDE8" },
  { name: "Gris Anthracite RAL 7016", hex: "#5A5A5A" },
  { name: "Noir RAL 9005", hex: "#1A1A1A" },
  { name: "Sable RAL 1015", hex: "#C8B48A" },
];

export { TOILE_COLORS, ARMATURE_COLORS };

export function useConfigurator() {
  const [width, setWidth] = useState(350);
  const [projection, setProjection] = useState(250);
  const [toileColor, setToileColor] = useState("Blanc Écru");
  const [armatureColor, setArmatureColor] = useState("Blanc RAL 9016");
  const [motorisation, setMotorisation] = useState(false);
  const [led, setLed] = useState(false);
  const [pack, setPack] = useState(false);

  const handlePackToggle = (checked: boolean) => {
    setPack(checked);
    if (checked) {
      setMotorisation(true);
      setLed(true);
    }
  };

  const handleMotorisationToggle = (checked: boolean) => {
    if (!pack) setMotorisation(checked);
  };

  const handleLedToggle = (checked: boolean) => {
    if (!pack) setLed(checked);
  };

  const surfaceArea = useMemo(
    () => parseFloat(((width / 100) * (projection / 100)).toFixed(2)),
    [width, projection]
  );

  const price = useMemo(() => {
    const baseRate = 580;
    const minPrice = 1890;
    let p = Math.max(minPrice, Math.round(surfaceArea * baseRate));
    if (pack) p += 590;
    else {
      if (motorisation) p += 390;
      if (led) p += 290;
    }
    return p;
  }, [surfaceArea, motorisation, led, pack]);

  const installmentPrice = useMemo(() => Math.round(price / 3), [price]);

  const optionsSummary = useMemo(() => {
    const parts: string[] = [];
    if (pack) parts.push("Pack Connect");
    else {
      if (motorisation) parts.push("Motorisation");
      if (led) parts.push("LED");
    }
    return parts.join(" + ") || "Aucune";
  }, [motorisation, led, pack]);

  return {
    width, setWidth,
    projection, setProjection,
    toileColor, setToileColor,
    armatureColor, setArmatureColor,
    motorisation, handleMotorisationToggle,
    led, handleLedToggle,
    pack, handlePackToggle,
    surfaceArea,
    price,
    installmentPrice,
    optionsSummary,
  };
}
