import { parseVersion3 } from './version3parser'
import { parseString, unpackInt } from './utils'


export class ReplayParser {

    parseFile(filename, data) {
        var magicNumber = parseString(data.slice(0, 4));
        var versionNumber = unpackInt(data.slice(4, 8));
        var protocolVersion = unpackInt(data.slice(8, 12));
        var spyPartyVersion = unpackInt(data.slice(12, 16));

        if (versionNumber == 3) {
            return parseVersion3(filename, data);
        } else {
            console.log("Unknown version");
            return undefined;
        }

        return {
            magic_number: magicNumber,
            version_number: versionNumber,
            protocol_version: protocolVersion,
            spy_party_version: spyPartyVersion
        };
    }
}
