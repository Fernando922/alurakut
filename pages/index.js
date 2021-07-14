import React, {useState} from 'react'
import Box from "../src/components/Box";
import MainGrid from "../src/components/MainGrid";
import {AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet} from '../src/lib/AlurakutCommons'
import {ProfileRelationsBoxWrapper} from '../src/components/ProfileRelations'


function ProfileSidebar({githubUser}){
  return (
    <Box as="aside">
      <img src={`https://github.com/${githubUser}.png`} style={{borderRadius: '8px'}}/>
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${githubUser}`}>
          @{githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}


export default function Home() {

  const githubUser= "Fernando922"
  const pessoasFavoritas = ["DiegoRugue", "flaviogf", "fjcunha", "guibermaia", "GlHenrique", "akitaonrails"]
  const [comunidades, setComunidades] = useState([
    {
      id: '12802378123789378912789789123896123', 
      title: 'Eu odeio acordar cedo',
      image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
    },
    {
      id: '12802378123789378912789789123896124', 
      title: 'Eu nunca terminei uma borracha',
      image: 'https://img.kalunga.com.br/fotosdeprodutos/070513z_3.jpg'
    },
    {
      id: '12802378123789378912789789123896124', 
      title: 'Eu leio o shampoo no banho',
      image: 'https://img10.orkut.br.com/community/7f317952d5b5d35ca52aa4a3d7679c66.jpg'
    },
  ]);


  const verifyCommunitiesLimit = () => {
    return comunidades.length === 6
  }


  const handleCriaComunidade = (e) => {
    e.preventDefault();

    const isCommunitiesLimitReached = verifyCommunitiesLimit()
    if(isCommunitiesLimitReached){
      return
    }
    const dadosDoForm = new FormData(e.target);

    const comunidade = {
      id: new Date().toISOString(),
      title: dadosDoForm.get('title'),
      image: dadosDoForm.get('image'),
    }
    const comunidadesAtualizadas = [...comunidades, comunidade];
    setComunidades(comunidadesAtualizadas)
  }

  return (
    <>
    <AlurakutMenu githubUser={githubUser}/>
    <MainGrid>
      <div className="profileArea" style={{ gridArea: "profileArea" }}>
        <ProfileSidebar githubUser={githubUser}/>
      </div>

      <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
        <Box>
          <h1 className="title">
            Bem Vindo(a), {githubUser}!
          </h1>
          <OrkutNostalgicIconSet />
        </Box>
        
        <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={handleCriaComunidade}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                  />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
      </div>

      <div
        className="profileRelationsArea"
        style={{ gridArea: "profileRelationsArea" }}
      >
        <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/users/${itemAtual.title}`}>
                      <img src={itemAtual.image} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
            Pessoas da comunidade ({pessoasFavoritas.length})
          </h2>
          <ul>
          {
          pessoasFavoritas.map((githubUser) => (
            <li key={githubUser}>
              <a href={`/users/${githubUser}`}>  
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
