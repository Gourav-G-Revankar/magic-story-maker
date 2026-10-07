// # Preset pickers for hero, place, object, lesson

import Picker from "./Picker";
import { PRESETS } from "../constants/storyPresets";

export default function PresetsTab({ values, onChange }) {
  return (
    <>
      <Picker
        title="🦸 Who is the hero?"
        items={PRESETS.characters}
        value={values.character}
        onChange={(val) => onChange("character", val)}
      />
      <Picker
        title="🏰 Where does it happen?"
        items={PRESETS.places}
        value={values.place}
        onChange={(val) => onChange("place", val)}
      />
      <Picker
        title="🎈 What special thing is there?"
        items={PRESETS.objects}
        value={values.object}
        onChange={(val) => onChange("object", val)}
      />
      <Picker
        title="💖 What do we learn?"
        items={PRESETS.morals}
        value={values.moral}
        onChange={(val) => onChange("moral", val)}
      />
    </>
  );
}
