import React from 'react'
import { useLocation } from 'react-router-dom'

export default function Config() {
    const location = useLocation()
    console.log(location.state);
  return (
    <div>Config, check console</div>
  )
}
