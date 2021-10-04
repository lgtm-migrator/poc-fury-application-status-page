/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

/**
 * This allows typescript to
 * import raster images without
 * throwing errors
 */
declare module "*.png";
declare module "*.jpg";

// Same for vector artworks
declare module "*.svg" {
  const content: any;
  export default content;
}
