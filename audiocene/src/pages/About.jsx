import NavBar from "../components/NavBar";
import styled from "styled-components";
import { QUERIES } from "../constants";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 120px;
  gap: 40px;
  max-width: 60ch;
  margin-bottom: 200px;

  @media ${QUERIES.mobile} {
    margin: 80px 40px 160px 40px;
    gap: 60px;
  }
`;

const MainPara = styled.p`
  font-size: 1.1rem;
  line-height: 1.5rem;

  @media ${QUERIES.mobile} {
    font-size: 1rem;
  }
`;

function About() {
  return (
    <>
      <NavBar />
      <Container>
        <MainPara>
          Audiocene is a project designed to encourage the sharing and
          exploration of field recordings from around the world.
        </MainPara>
        <MainPara>
          Inspired by an interest in ambient sound and acoustic ecology, the
          project is intended to facilitate access to a variety of soundscapes,
          both for personal use and as a record of environmental change over
          time.
        </MainPara>
        <MainPara>
          Questions, comments, bug reports etc. can be sent to &nbsp;
          <a href="mailto:info@audiocene.world" target="_blank">
            info@audiocene.world
          </a>
        </MainPara>
      </Container>
      <Container>
        <MainPara>
          Front page shader inspired by Bruno Simon’s{" "}
          <a href="https://threejs-journey.com/" target="_blank">
            Three.js Journey
          </a>
        </MainPara>
      </Container>
    </>
  );
}

export default About;
