import { provideApolloClient } from '@vue/apollo-composable';
import type { ApolloClient } from '@apollo/client/core';
import { ApolloLink, from } from '@apollo/client/core';
import { alertStore } from '@/store/alert';

export default defineNuxtPlugin(({ hook }) => {
  const { clients } = useApollo();
  const defaultClient: ApolloClient<any> = (clients as any).default;

  const alertLink = new ApolloLink((operation, forward) => {
    return forward(operation).map((data) => {
      const alert = alertStore();
      const res = data.data[Object.keys(data.data)[0]];
      if (
        res.hasOwnProperty('code') &&
        res.code &&
        res.code !== 'none' &&
        res.hasOwnProperty('response') &&
        res.response
      )
        alert.show(res.response, res.code);
      return data;
    });
  });

  defaultClient.setLink(from([alertLink, defaultClient.link]));
  provideApolloClient(defaultClient);

  hook('apollo:error', (error) => {
    console.error('error: ', error);
  });
});
