import test from 'ava';
import { splitFolderName } from './EnsurePath.js'

test(`splitFolderName`, t => {

  t.deepEqual(splitFolderName(`c:\\`), [ `c:\\`, `` ]);
  t.deepEqual(splitFolderName(`c:\\file.ext`), [ `c:\\`, `file.ext` ]);
  t.deepEqual(splitFolderName(`c:\\folder\\`), [ `c:\\folder\\`, `` ]);
  t.deepEqual(splitFolderName(`c:\\folder.blah\\`), [ `c:\\folder.blah\\`, `` ]);
  t.deepEqual(splitFolderName(`c:\\folder.blah\\file.ext`), [ `c:\\folder.blah\\`, `file.ext` ]);

  t.deepEqual(splitFolderName(`/Users/test/file.ext`), [ `/Users/test/`, `file.ext` ]);
  t.deepEqual(splitFolderName(`/Users/test/`), [ `/Users/test/`, `` ]);

  // AMBIGUOUS
  // By default, assumes files must have a period ('.')
  t.deepEqual(splitFolderName(`/Users/test`), [ `/Users/test`, `` ]);

  t.deepEqual(splitFolderName(`/Users/test`, { filesWithPeriods: false }), [ `/Users/`, `test` ]);
  t.deepEqual(splitFolderName(`/Users/test`, { filesWithPeriods: false, trailingSlashFolder: true }), [ `/Users/`, `test` ]);
  t.deepEqual(splitFolderName(`/Users/test/`, { filesWithPeriods: false, trailingSlashFolder: true }), [ `/Users/test/`, `` ]);


})