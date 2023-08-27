export function ClassNames(...classes: (string | boolean)[]): string {
	return classes.filter(Boolean).join(' ')
}
