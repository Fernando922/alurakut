import Box from "../src/components/Box";
import MainGrid from "../src/components/MainGrid";
import {AlurakutMenu, OrkutNostalgicIconSet} from '../src/lib/AlurakutCommons'
import {ProfileRelationsBoxWrapper} from '../src/components/ProfileRelations'


function ProfileSidebar({githubUser}){
  return (
    <Box>
      <img src={`https://github.com/${githubUser}.png`} style={{borderRadius: '8px'}}/>
    </Box>
  )
}


export default function Home() {

  const githubUser= "Fernando922"
  const pessoasFavoritas = ["juunegreiros", "omariosouto", "peas", "rafaballerini", "marcobrunodev", "felipefialho"]



  return (
    <>
    <AlurakutMenu />
    <MainGrid>
      <div className="profileArea" style={{ gridArea: "profileArea" }}>
        <ProfileSidebar githubUser={githubUser}/>
      </div>

      <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
        <Box>
          <h1 className="title">
            Bem Vindo(a)
          </h1>
          <OrkutNostalgicIconSet />
        </Box>
      </div>

      <div
        className="profileRelationsArea"
        style={{ gridArea: "profileRelationsArea" }}
      >
        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
            Pessoas da comunidade ({pessoasFavoritas.length})
          </h2>
          <ul>
          {
          pessoasFavoritas.map((githubUser) => (
            <li>
              <a href={`/users/${githubUser}`} key={githubUser}>  
                <img src={`https://github.com/${githubUser}.png`} />
                <span>{githubUser}</span>
              </a>
            </li>
          ))}
          </ul>
         
        </ProfileRelationsBoxWrapper>
      </div>
    </MainGrid>
    </>
  );
}
