/**
 * AboutPanel displays information about the application.
 */
import { constants } from "@utils/constants";

const AboutPanel = () => (
  <div className="about-panel-container">
    <h2 className="about-panel-title">{constants.aboutPanelData.header}</h2>
    <div className="about-panel-content">
      <p>
        {constants.aboutPanelData.welcomeMessage}
        <b>{constants.aboutPanelData.welcomeMessage1}</b>!<br />
        {constants.aboutPanelData.welcomeMessage2}
        <br />
        {constants.aboutPanelData.welcomeMessage3}
        <br />
        <br />
        <i>{constants.aboutPanelData.welcomeMessage4}</i>
      </p>
    </div>
  </div>
);

export default AboutPanel;
