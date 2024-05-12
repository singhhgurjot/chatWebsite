import React from 'react'
import {Skeleton, Stack} from "@chakra-ui/react";
export default function chatLoading() {
  return (
    <Stack>
        <Skeleton height="50px" />
          <Skeleton height="50px" />
          <Skeleton height="50px" />
          <Skeleton height="50px" />
          <Skeleton height="50px" />
          <Skeleton height="50px" />
          <Skeleton height="50px" />
    </Stack>
  )
}
