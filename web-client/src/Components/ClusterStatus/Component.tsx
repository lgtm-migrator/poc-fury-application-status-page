import React from "react";
import {
  EuiFlexGroup,
  EuiPanel,
  EuiHeaderBreadcrumbs,
  EuiPage,
  EuiPageBody, EuiPageHeader, EuiPageContent, EuiPageHeaderSection, EuiFlexItem, EuiText, EuiIcon, EuiLink, EuiTitle
} from "fury-design-system";
import "./Style.css";
import {EuiCustomLink} from "../EuiCustomLink";

interface ClusterStatusComponentProps {
  language: string;
  releaseNumber: string;
  clusterList: any[];
}

interface ClusterCardProps {
  cluster: any;
}

const ClusterCard = (props: ClusterCardProps) => {
 return (
   <EuiPanel paddingSize="s" className="cluster-card" >
     <EuiFlexGroup gutterSize="m" alignItems={"center"} responsive={false}>
       <EuiFlexItem grow={false}>
         <EuiIcon size={"l"} type="checkInCircleFilled" color={"success"} />
       </EuiFlexItem>
       <EuiFlexItem grow={false}>
         <EuiText size="s" >
           <p>
             <strong>{props.cluster.name}</strong>
           </p>
         </EuiText>
       </EuiFlexItem>
       <EuiFlexItem style={{marginLeft: "auto"}} grow={false}>
         {/* TODO: Add BasePath */}
         <EuiCustomLink to={`${props.cluster.id}/status`}>
           see <EuiIcon type={"sortRight"} />
         </EuiCustomLink>
       </EuiFlexItem>
     </EuiFlexGroup>
   </EuiPanel>
 )
}

const ClusterStatusComponent = (props: ClusterStatusComponentProps) => {
  const breadcrumbs = [
    {
      text: 'All company systems',
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
      },
      className: 'no-mouse-event'
    },
    {
      text: '',
      className: 'no-show',
    }
  ]
  return (
    <>
      <EuiPage paddingSize="none" restrictWidth={true}>
        <EuiPageBody>
          <EuiPageHeader
            restrictWidth
            paddingSize="l"
          >
            <EuiPageHeaderSection>
              <EuiHeaderBreadcrumbs
                aria-label="Header breadcrumbs example"
                breadcrumbs={breadcrumbs}
                responsive={false}
                className={"ml-0"}
              />
            </EuiPageHeaderSection>
          </EuiPageHeader>
          <EuiPageContent
            borderRadius="none"
            hasShadow={false}
            style={{ display: 'flex' }}
            color="transparent"
          >
            <EuiPageContent
              horizontalPosition="center"
              paddingSize="none"
              color="transparent"
              style={{ maxWidth: "600px", width: "100%" }}
              hasShadow={false}>
              <EuiFlexGroup gutterSize="m" alignItems={"center"} justifyContent={"center"} direction={"column"} responsive={false}>
                <EuiFlexItem>
                  <EuiIcon size={"xxl"} type="checkInCircleFilled" color={"success"} />
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiTitle size={"s"} className={"cluster-status-text"}>
                    <h1>
                      All CompanyName systems are fully operational
                    </h1>
                  </EuiTitle>
                </EuiFlexItem>
              </EuiFlexGroup>
              {props.clusterList.length > 0 ?
                props.clusterList.map((cluster) =>
                  <ClusterCard cluster={cluster} key={cluster.id}/>
                )
              : (
                <div>No cluster found</div>
              )}
            </EuiPageContent>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    </>
  );
};

export default ClusterStatusComponent;
