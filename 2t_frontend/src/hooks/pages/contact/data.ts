import { ContactManifests } from "data/standard/document";

export function fetchContactManifests([contactManifests, setContactManifests]: [ContactManifests, React.Dispatch<React.SetStateAction<ContactManifests>>]) {
    setContactManifests([]);
}