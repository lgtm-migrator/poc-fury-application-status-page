/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, { useContext } from "react";
import {
  EuiIcon,
  EuiText,
  EuiTitle,
  EuiHeader,
  EuiHideFor,
  EuiShowFor,
  EuiTextColor,
  EuiHeaderSectionItem,
} from "fury-design-system";
import { logger } from '../../Services/Logger';

import { ResponsiveHeaderProps } from './types';
import { EuiCustomLink } from "../EuiCustomLink";
import { LocalizedText } from "./LocalizedText";
import kasperLogo from '../../Assets/kasper-logo-small.png';
import './index.scss';


/**
 * Responsive header 
 * @param props 
 * @returns 
 */
export const ResponsiveHeader = (props: ResponsiveHeaderProps) => {
  // TODO: add single group page handling
  // without back button

  console.log('context', props)
  return (
    <div className="kasper-header">
      <EuiHeader position="fixed">
        <EuiHeaderSectionItem>
          
          {
            props.pageName
            ? <EuiCustomLink to={`${props.context.basePath}/`}>
                <EuiIcon type={"sortLeft"}/> {LocalizedText.singleton.goBack}
              </EuiCustomLink>
            : <>
                <EuiIcon type={kasperLogo} size="xl" />
                <EuiText>
                  <h5>
                    Kasper
                  </h5>
                </EuiText>
              </>
          }
        </EuiHeaderSectionItem>

        {/* DESKTOP MENU */}
        <EuiHideFor sizes={['xs', 's']}>
          <EuiHeaderSectionItem>
            <EuiTitle size="xs"><p>{props.pageName ? props.pageName : ''}</p></EuiTitle>
          </EuiHeaderSectionItem>
        </EuiHideFor>
        {/* DESKTOP MENU END */}

        {/* MOBILE MENU */}
        <EuiShowFor sizes={['xs', 's']}>
          <EuiHeaderSectionItem>
            <EuiTitle size="xs"><p>{props.pageName ? props.pageName : ''}</p></EuiTitle>
          </EuiHeaderSectionItem>
        </EuiShowFor>
        {/* MOBILE MENU END */}
      </EuiHeader>
    </div>
  )
}