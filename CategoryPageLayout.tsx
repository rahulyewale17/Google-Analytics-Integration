/*
 *==================================================
 * Licensed Materials - Property of HCL Technologies
 *
 * HCL Commerce
 *
 * (C) Copyright HCL Technologies Limited 2020
 *
 *==================================================
 */
//Standard libraries
import React from "react";
//UI
import { StyledGrid, StyledContainer } from "../../StyledUI";
import GTMDLService from "../../../_foundation/apis/gtm/gtmDataLayer.service";
import GADataService from "../../../_foundation/apis/gtm/gaData.service";

const CategoryPageLayout: React.FC<any> = ({
  cid,
  hero,
  contentSection,
  ...props
}: any) => {
  let { page } = props;
  if (!page) {
    page = {};
  }
  const Hero = () => {
    return (
      <>
        {hero && (
          <StyledGrid container>
            <StyledGrid item xs={12}>
              {hero.map((e: any) => {
                const CurrentComponent = e.CurrentComponent;
                return (
                  <div key={e.key}>
                    <CurrentComponent />
                  </div>
                );
              })}
            </StyledGrid>
          </StyledGrid>
        )}
      </>
    );
  };

  const ContentSection = () => {
    return (
      <>
        {contentSection && (
          <StyledGrid container>
            {contentSection.map((e: any) => {
              const CurrentComponent = e.CurrentComponent;
              return (
                <StyledGrid item key={e.key}>
                  <CurrentComponent />
                </StyledGrid>
              );
            })}
          </StyledGrid>
        )}
      </>
    );
  };
  /**GA360**/
  React.useEffect(() => {
    GADataService.sendContentPageViewEvent();
  }, [cid])
  
  /**GA360**/
  return (
    <StyledContainer id={cid}>
      <Hero />
      <ContentSection />
    </StyledContainer>
  );
};

export default CategoryPageLayout;
