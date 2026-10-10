import Picker from "./Picker";

export default function PresetsTab({ t, presets, values, onChange }) {
  return (
    <>
      <Picker
        title={t.pickerHero}
        items={presets.characters}
        value={values.character}
        onChange={(val) => onChange("character", val)}
      />
      <Picker
        title={t.pickerPlace}
        items={presets.places}
        value={values.place}
        onChange={(val) => onChange("place", val)}
      />
      <Picker
        title={t.pickerObject}
        items={presets.objects}
        value={values.object}
        onChange={(val) => onChange("object", val)}
      />
      <Picker
        title={t.pickerMoral}
        items={presets.morals}
        value={values.moral}
        onChange={(val) => onChange("moral", val)}
      />
    </>
  );
}
