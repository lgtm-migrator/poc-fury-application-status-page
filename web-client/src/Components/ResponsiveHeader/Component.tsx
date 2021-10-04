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
  EuiSpacer,
  EuiHideFor,
  EuiShowFor,
  EuiHeaderSectionItem,
} from "fury-design-system";
import { ResponsiveHeaderProps } from "./types";
import EuiCustomLink from "../EuiCustomLink";
import LocalizedText from "./LocalizedText";
import kasperLogo from "../../Assets/kasper-logo-small.png";
import "./Style.scss";

/**
 * Responsive header
 * @param props ResponsiveHeaderProps
 * @returns different headers based on mobile/desktop devices
 */
export default (props: ResponsiveHeaderProps) => {
  const { pageName, standalone, context } = props;

  return (
    <div className="kasper-header">
      {/* DESKTOP MENU */}
      <EuiHideFor sizes={["xs", "s"]}>
        <EuiHeader position="fixed" className="kasper-header--desktop">
          <EuiHeaderSectionItem>
            <>
              <EuiIcon type={kasperLogo} size="xl" />
              <EuiText>
                <h5>Kasper</h5>
              </EuiText>
            </>
          </EuiHeaderSectionItem>
        </EuiHeader>
        {/* Handling healthchecks page both nested and standalone */}
        {pageName && (
          <>
            <EuiHeader position="fixed" className="sub-navigation">
              <EuiHeaderSectionItem>
                {!standalone && (
                  <EuiCustomLink to={`${context.basePath}/`}>
                    <EuiIcon type="sortLeft" /> {LocalizedText.singleton.goBack}
                  </EuiCustomLink>
                )}
              </EuiHeaderSectionItem>
              <EuiHeaderSectionItem>
                <EuiTitle size="xs">
                  <p>{pageName || ""}</p>
                </EuiTitle>
              </EuiHeaderSectionItem>
            </EuiHeader>
            <EuiSpacer size="l" />
            <EuiSpacer size="xl" />
          </>
        )}
        <EuiSpacer size="xxl" />
      </EuiHideFor>
      {/* DESKTOP MENU END */}

      {/* MOBILE MENU */}
      <EuiShowFor sizes={["xs", "s"]}>
        <EuiHeader position="fixed" className="kasper-header--mobile">
          {/* Handling healthchecks page both nested and standalone */}
          <EuiHeaderSectionItem>
            {!standalone && pageName ? (
              <EuiCustomLink to={`${context.basePath}/`}>
                <EuiIcon type="sortLeft" /> {LocalizedText.singleton.goBack}
              </EuiCustomLink>
            ) : (
              <>
                <EuiIcon type={kasperLogo} size="xl" />
                <EuiText>
                  <h5>Kasper</h5>
                </EuiText>
              </>
            )}
          </EuiHeaderSectionItem>
          <EuiHeaderSectionItem>
            <EuiTitle size="xs">
              <p>{pageName || ""}</p>
            </EuiTitle>
          </EuiHeaderSectionItem>
        </EuiHeader>
        <EuiSpacer size="xxl" />
      </EuiShowFor>
      {/* MOBILE MENU END */}
    </div>
  );
};
