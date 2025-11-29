/** @format */

"use client"
import {motion} from "framer-motion"

export default function FancyCard({children}: {children: any}) {
  return (
    <motion.div
      className='card p-6 cursor-pointer'
      whileHover={{
        scale: 1.05,
        boxShadow: "0px 20px 50px rgba(0,0,0,0.5)"
      }}
      whileTap={{scale: 0.97}}
      transition={{type: "spring", stiffness: 300, damping: 20}}>
      {children}
    </motion.div>
  )
}
