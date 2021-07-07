import React from 'react';
import { EuiLink } from 'fury-design-system';
import { useHistory } from 'react-router-dom';
import {logger} from "../../Services/Logger";

const isModifiedEvent = (event: React.MouseEvent<HTMLAnchorElement>) =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

const isLeftClickEvent = (event: React.MouseEvent<HTMLAnchorElement>) => event.button === 0;

const isTargetBlank = (event: React.MouseEvent<HTMLAnchorElement>) => {
  const target = (event.target as HTMLAnchorElement).getAttribute('target');
  return target && target !== '_self';
};

// TODO: fix any type on props
export default function EuiCustomLink({ to, ...rest }: any) {
  // This is the key!
  const history = useHistory();

  function onClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented) {
      return;
    }
    // Let the browser handle links that open new tabs/windows
    if (isModifiedEvent(event) || !isLeftClickEvent(event) || isTargetBlank(event)) {
      return;
    }
    // Prevent regular link behavior, which causes a browser refresh.
    event.preventDefault();
    // Push the route to the history.
    history.push(to);
    logger.info(JSON.stringify(history))
    logger.info(to)
  }

  // Generate the correct link href (with basename accounted for)
  const href = history.createHref({ pathname: to });

  const props = { ...rest, href, onClick };
  return <EuiLink {...props} />;
}