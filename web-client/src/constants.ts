/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

const releaseNumber = process.env.RELEASE_TAG ?? `hash: ${ process.env.COMMIT }`
const moduleKey: string | undefined = process.env.MODULE_KEY;

export {
  releaseNumber,
  moduleKey
}

