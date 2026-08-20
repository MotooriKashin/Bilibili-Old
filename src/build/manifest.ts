import manifest from "../../manifest.json" with {type: 'json'};
import { writeFile } from 'fs/promises';

import '../slogan';

Reflect.deleteProperty(manifest, '$schema'); // 移除 $schema 键

writeFile('./dist/manifest.json', JSON.stringify(manifest, undefined, '\t'));