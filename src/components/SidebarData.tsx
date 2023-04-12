import React from 'react'
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import {FiCircle} from 'react-icons/fi'
import {IoAnalyticsOutline} from 'react-icons/io5'
import { color } from '@mui/system';

export const SidebarData= [
    {
        title: 'Download Product Artifacts',
        path: '/overview',
        icon: <FiCircle style={{fontSize:"0.5rem"}}/>,
        //iconClosed: <AiIcons.AiOutlineDownload></AiIcons.AiOutlineDownload>,
        //iconOpened: <AiIcons.AiOutlineDownload/>,
    
        subNav: [
          {
            title: 'Users',
            path: '/overview/users',
            icon: <IoIcons.IoIosPaper />
          },
          {
            title: 'Revenue',
            path: '/overview/revenue',
            icon: <IoIcons.IoIosPaper />
          }
        ]
      },
      {
        title: 'Pre-Flight Checks',
        path: '/about',
        icon: <FiCircle style={{fontSize:"0.5rem"}}/>,
        iconClosed: <AiIcons.AiOutlineDownload/>,
        iconOpened: <AiIcons.AiOutlineDownload/>
    
        
      },
      {
        title: 'Install and Configure',
        path: '/install',
        icon: <AiIcons.AiFillBulb style={{color:"green"}}/>,
        iconClosed: <AiIcons.AiOutlineCheckCircle style={{color:"green"}}></AiIcons.AiOutlineCheckCircle>,
        iconOpened: <AiIcons.AiOutlineCheckCircle/>,
    
        subNav: [
          {
            title: 'SLE',
            path: '/s0',
            icon:  <AiIcons.AiOutlineCheckCircle />
          },
          {
            title: 'SLS',
            path: '/s1',
            icon:  <AiIcons.AiOutlineCheckCircle />
          },
          {
            title: 'COS',
            path: '/overview/s2',
            icon:  <AiIcons.AiOutlineCheckCircle />
          },
          {
            title: 'HFP',
            path: '/overview/s3',
            icon:  <AiIcons.AiOutlineCheckCircle />
          },
          {
            title: 'CSM',
            path: '/csm',
            icon:  <AiIcons.AiOutlineCheckCircle />,
            iconClosed: <AiIcons.AiOutlineCheckCircle />,
            iconOpened: <AiIcons.AiOutlineCheckCircle />,

            subNav:[
              {
                title: 'Stage-0 Prerequisites',
                path: '/s0',
                icon:  <AiIcons.AiOutlineCheckCircle className='side_icons'/>
              },
              {
                title: 'Stage-1 Ceph Image upgrade',
                path: '/s1',
                icon:  <AiIcons.AiOutlineCheckCircle className='side_icons'/>
              },
              {
                title: 'Stage-2 Kubernetes upgrade',
                path: '/s2',
                icon:  <AiIcons.AiOutlineCheckCircle className='side_icons'/>
              },
              {
                title: 'Stage-3 CSM Service upgrade',
                path: '/s3',
                icon:  <AiIcons.AiOutlineCheckCircle className='side_icons'/>
              },
              {
                title: 'Stage-4 Ceph upgrade',
                path: '/s4',
                icon:  <AiIcons.AiOutlineCheckCircle className='side_icons'/>
              }

            ]
        
      },
      {
        title: 'SMA',
        path: '/overview/s3',
        icon:  <AiIcons.AiOutlineCheckCircle />
      },
      {
        title: 'SAT',
        path: '/overview/s3',
        icon:  <AiIcons.AiOutlineCheckCircle />
      },
      {
        title: 'UAN',
        path: '/overview/s3',
        icon:  <AiIcons.AiOutlineCheckCircle />
      },
      {
        title: 'Analytics',
        path: '/overview/s3',
        icon:  <AiIcons.AiOutlineCheckCircle />
      }
        
    ]
  }
      
   
  

]