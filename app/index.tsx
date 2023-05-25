import React, { useEffect } from 'react'
import { api } from '../src/lib/api'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'

import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/3d55818115fb69802fc3',
}

export default function App() {
  const router = useRouter()

  const [, response, signInWithGithub] = useAuthRequest(
    {
      clientId: 'addf403be66f9e0990cf',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime',
      }),
    },
    discovery,
  )

  async function handleGithubOauthCode(code: string) {
    const response = await api.post('/register', {
      code,
    })

    const { token } = response.data

    await SecureStore.setItemAsync('token', token)
    router.push('/memories')
  }

  useEffect(() => {
    console.log(
      makeRedirectUri({
        scheme: 'nlwspacetime',
      }),
    )

    if (response?.type === 'success') {
      const { code } = response.params

      handleGithubOauthCode(code)
    } // eslint-disable-next-line
  }, [response])

  return (
    <View className="flex-1 items-center  px-8 py-10">
      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo />
        <View className="space-y-2">
          <Text className="font-title text-center text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="font-body text-center text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-2"
          onPress={() => signInWithGithub()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            Cadastrar lembrança
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="font-body text-center text-sm leading-relaxed text-gray-500 ">
        Feito com 💜 no NLW da Rocketseat
      </Text>
    </View>
  )
}
