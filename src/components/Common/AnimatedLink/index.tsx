'use client';

import React, { useState } from 'react';
import { Variants } from 'framer-motion';
import { Div, Word, Span, AbsoluteContainer } from './styles';

/* ================================
   ANIMACIONES
================================ */

// Animación del contenedor
const titleAnimation: Variants = {
  rest: {
    transition: {
      staggerChildren: 0.01,
    },
  },
  hover: {
    transition: {
      staggerChildren: 0.01,
    },
  },
};

// Letras principales
const letterAnimation: Variants = {
  rest: {
    y: 0,
  },
  hover: {
    y: -25,
    transition: {
      duration: 0.3,
      ease: [0.6, 0.01, 0.05, 0.95],
    },
  },
};

// Letras secundarias
const letterAnimationTwo: Variants = {
  rest: {
    y: 25,
  },
  hover: {
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.6, 0.01, 0.05, 0.95],
    },
  },
};

/* ================================
   COMPONENTE PRINCIPAL
================================ */

const AnimatedLink = ({ title }: { title: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatedWord
        title={title}
        animations={letterAnimation}
        isHovered={isHovered}
      />

      <AbsoluteContainer>
        <AnimatedWord
          title={title}
          animations={letterAnimationTwo}
          isHovered={isHovered}
        />
      </AbsoluteContainer>
    </Div>
  );
};

export default AnimatedLink;

/* ================================
   PALABRA ANIMADA
================================ */

type AnimatedWordProps = {
  title: string;
  animations: Variants;
  isHovered: boolean;
};

const AnimatedWord = ({
  title,
  animations,
  isHovered,
}: AnimatedWordProps) => {
  return (
    <Word
      variants={titleAnimation}
      initial="rest"
      animate={isHovered ? 'hover' : 'rest'}
    >
      {title.split('').map((char, i) =>
        char === ' ' ? (
          <Span key={i}>&nbsp;</Span>
        ) : (
          <Span key={i} variants={animations}>
            {char}
          </Span>
        )
      )}
    </Word>
  );
};
