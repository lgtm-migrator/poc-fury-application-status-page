/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React from "react";
import {
  EuiIcon,
  EuiText,
  EuiTitle,
  EuiHeader,
  EuiHideFor,
  EuiShowFor,
  EuiHeaderSectionItem,
} from "fury-design-system";
import { ResponsiveHeaderProps } from './types';
import { EuiCustomLink } from "../EuiCustomLink";
import { LocalizedText } from "./LocalizedText";
import kasperLogo from '../../Assets/kasper-logo-small.png';
import './Style.scss';

/**
 * Responsive header 
 * @param props ResponsiveHeaderProps
 * @returns different headers based on mobile/desktop devices
 */
export const ResponsiveHeader = (props: ResponsiveHeaderProps) => {
  return (
    <div className="kasper-header">
        {/* DESKTOP MENU */}
        <EuiHideFor sizes={['xs', 's']}>
          <EuiHeader position="fixed" className="kasper-header--desktop">
            <EuiHeaderSectionItem>
              <>
                <EuiIcon type={kasperLogo} size="xl" />
                <EuiText>
                  <h5>
                    Kasper
                  </h5>
                </EuiText>
              </>
            </EuiHeaderSectionItem>
          </EuiHeader>
          {props.pageName &&
            <EuiHeader position="static" className="sub-navigation">
              <EuiHeaderSectionItem>
                <EuiCustomLink to={`${props.context.basePath}/`}>
                  <EuiIcon type={"sortLeft"}/> {LocalizedText.singleton.goBack}
                </EuiCustomLink>
              </EuiHeaderSectionItem>
              <EuiHeaderSectionItem>
                <EuiTitle size="xs"><p>{props.pageName ? props.pageName : ''}</p></EuiTitle>
              </EuiHeaderSectionItem>
            </EuiHeader>
          }
        </EuiHideFor>
        {/* DESKTOP MENU END */}

        {/* MOBILE MENU */}
        <EuiShowFor sizes={['xs', 's']}>
          <EuiHeader position="fixed" className="kasper-header--mobile">
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
            <EuiHeaderSectionItem>
              <EuiTitle size="xs"><p>{props.pageName ? props.pageName : ''}</p></EuiTitle>
            </EuiHeaderSectionItem>
          </EuiHeader>
        </EuiShowFor>
        {/* MOBILE MENU END */}
    </div>
  )
}
