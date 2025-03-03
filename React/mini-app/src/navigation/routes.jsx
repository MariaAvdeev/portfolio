import React from 'react';
import { IndexPage } from '@/pages/IndexPage/IndexPage';
import { BoostPage } from '@/pages/BoostPage/BoostPage';
import { TopPage } from '@/pages/TopPage/TopPage';
import { EarnPage } from '@/pages/EarnPage/EarnPage';
import { InfoPage } from '@/pages/InfoPage/InfoPage';

export const routes = [
  { path: '/', Component: IndexPage },
  { path: '/boost', Component: BoostPage, title: 'Boost' },
  { path: '/top', Component: TopPage, title: 'Top' },
  { path: '/earn', Component: EarnPage, title: 'Earn' },
  { path: '/info', Component: InfoPage, title: 'Info' },
  
    // icon: (
    //   <svg
    //     xmlns="http://www.w3.org/2000/svg"
    //     width="100%"
    //     height="100%"
    //     viewBox="0 0 56 56"
    //     fill="none"
    //   >
    //     <path
    //       d="M28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z"
    //       fill="#0098EA"
    //     />
    //     <path
    //       d="M37.5603 15.6277H18.4386C14.9228 15.6277 12.6944 19.4202 14.4632 22.4861L26.2644 42.9409C27.0345 44.2765 28.9644 44.2765 29.7345 42.9409L41.5381 22.4861C43.3045 19.4251 41.0761 15.6277 37.5627 15.6277H37.5603ZM26.2548 36.8068L23.6847 31.8327L17.4833 20.7414C17.0742 20.0315 17.5795 19.1218 18.4362 19.1218H26.2524V36.8092L26.2548 36.8068ZM38.5108 20.739L32.3118 31.8351L29.7417 36.8068V19.1194H37.5579C38.4146 19.1194 38.9199 20.0291 38.5108 20.739Z"
    //       fill="white"
    //     />
    //   </svg>
    // ),
];
