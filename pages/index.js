import React, {useState, useEffect} from 'react'
import Box from "../src/components/Box";
import MainGrid from "../src/components/MainGrid";
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
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

function ProfileRelationsBox(propriedades) {
  const shuffledUsersList = propriedades.items.slice(0,6)

  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>
      <ul>
        {
          shuffledUsersList.map((itemAtual) => {
            return (
              <li key={itemAtual.login}>
                <a href={`https://github.com/${itemAtual.login}.png`}>
                  <img src={`${itemAtual.html_url}.png`} />
                  <span>{itemAtual.login}</span>
                </a>
              </li>
            )
          })
        }
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}


export default function Home(props) {

  const githubUser= props.githubUser
  const pessoasFavoritas = ["DiegoRugue", "flaviogf", "fjcunha", "guibermaia", "GlHenrique", "akitaonrails"]
  const [seguidores, setSeguidores] = useState([]);
  const [comunidades, setComunidades] = React.useState([]);

  useEffect(function() {
    function fetchGithubUserFollowers(){
      fetch(`https://api.github.com/users/${githubUser}/followers`)
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json();
      })
      .then(function(respostaCompleta) {
        setSeguidores(respostaCompleta);
      })
    }

    function fetchCommunitiesList(){
      fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': 'd8801fcccedb628048297fff4a9a4e',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ "query": `query {
        allCommunities {
          id 
          title
          imageUrl
          creatorSlug
        }
      }` })
    })
    .then((response) => response.json()) // Pega o retorno do response.json() e já retorna
    .then((respostaCompleta) => {
      const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
      setComunidades(comunidadesVindasDoDato)
    })
 
    }

    fetchGithubUserFollowers()
    fetchCommunitiesList()
  }, [])


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
      title: dadosDoForm.get('title'),
      imageUrl: dadosDoForm.get('image'),
      creatorSlug: githubUser,
    }
    const comunidadesAtualizadas = [...comunidades, comunidade];
    setComunidades(comunidadesAtualizadas)

    fetch('/api/comunidades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comunidade)
    })
    .then(async (response) => {
      const dados = await response.json();
      const comunidade = dados.registroCriado;
      const comunidadesAtualizadas = [...comunidades, comunidade];
      setComunidades(comunidadesAtualizadas)
    })
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
        <ProfileRelationsBox title="Seguidores" items={seguidores} />
        <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                     <a href={`/communities/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl} />
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

export async function getServerSideProps(context) {
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN;
  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
        Authorization: token
      }
  })
  .then((resposta) => resposta.json())

  if(!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(token);
  return {
    props: {
      githubUser
    }, // will be passed to the page component as props
  }
} 
