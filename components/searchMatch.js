import characters from "@/data/characters.json";

export default function searchMatch(descriptionsToggle, search, key) {
	if (typeof descriptionsToggle == Boolean || !search || search.length == 0) return true;
	const me = characters[key];
	if (!descriptionsToggle)
		return me.Name.toLowerCase().includes(search.toLowerCase());
	const str = JSON.stringify(Object.values(me)).toLowerCase();
	if (str.includes(search.toLocaleLowerCase())) return true;
	return false;
}
