/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import {useEffect} from "react";

// This function is needed to catch async throws in Error Boundary
export default function useErrorHandler(error: string) {
 useEffect(() => {
  if (error) throw new Error(error);
 }, [error])
}
