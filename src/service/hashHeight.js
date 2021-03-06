import { Hash, emptyHash } from "./hash";

class HashHeight {
    constructor(height, hash) {
        this.height = height;
        this.hash = hash;
    }

    static FromJson(json) {
        return new HashHeight(
            json["height"],
            Hash.Parse(json["hash"]),
        );
    }
}
const emptyHashHeight = new HashHeight(0, emptyHash);
/*export default {
    HashHeight,
    emptyHashHeight: new HashHeight(0, emptyHash)
};*/
export {
    HashHeight,
    emptyHashHeight
};