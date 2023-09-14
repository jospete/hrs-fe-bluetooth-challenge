import { hexToBytes, isValidHexString } from "./convert";

describe(`convert functions`, () => {

    describe(`isValidHexString`, () => {

        it(`accepts lower case hex strings`, () => {
            expect(isValidHexString(`aa`)).toBe(true);
            expect(isValidHexString(`aabb`)).toBe(true);
            expect(isValidHexString(`ccddee`)).toBe(true);
        });
    
        it(`accepts upper case hex strings`, () => {
            expect(isValidHexString(`AA`)).toBe(true);
            expect(isValidHexString(`aaBB`)).toBe(true);
            expect(isValidHexString(`CCddEE`)).toBe(true);
        });
    
        it(`does NOT accept strings that are not a multiple of 2`, () => {
            expect(isValidHexString(`A`)).toBe(false);
            expect(isValidHexString(`aaB`)).toBe(false);
            expect(isValidHexString(`CCdEE`)).toBe(false);
        });
    
        it(`does NOT accept that contain non-hex characters`, () => {
            expect(isValidHexString(`A!`)).toBe(false);
            expect(isValidHexString(`GaaB`)).toBe(false);
            expect(isValidHexString(`12345-`)).toBe(false);
        });
    
        it(`does NOT accept empty strings or falsy values`, () => {
            expect(isValidHexString(``)).toBe(false);
            expect(isValidHexString(null as any)).toBe(false);
            expect(isValidHexString({} as any)).toBe(false);
            expect(isValidHexString(0 as any)).toBe(false);
        });
    });

    describe(`hexToBytes`, () => {

        it(`generates a number array based on the given input string`, () => {
            expect(hexToBytes(`0001020304`)).toEqual([0, 1, 2, 3, 4]);
            expect(hexToBytes(`feff`)).toEqual([254, 255]);
        });
    });
});