/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

declare module 'react-to-webcomponent' {

  import React from 'react';

  export default function reactToWebComponent(component: (props: any) => JSX.Element, react: React, reactDom: any);
}
