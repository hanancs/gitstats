import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Octicon, { Bug } from '@primer/octicons-react';
import { Head, Corner } from '../components';
import { theme, mixins } from '../style';
import { useRouter } from 'next/router'
const { colors } = theme;

const ErrorStyles = styled.div`
  ${mixins.flexCenter};
  flex-direction: column;
  background-color: ${colors.black};
  background-image: linear-gradient(${colors.black} 0%, ${colors.darkGrey} 100%);
  color: ${colors.offWhite};
  height: 100vh;
  padding-bottom: 20vh;
  font-size: 1.5rem;
  svg {
    color: ${colors.blue};
    margin-bottom: 3rem;
  }
  p {
    font-size: 1rem;
  }
  a {
    color: ${colors.lightblue};
    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }
  button{
    color: ${colors.white};
    background-color: ${colors.blue};
    font-size: 1.5em;
    margin: 1em;
    padding: 0.25em 1em;
    border: none;
    border-radius: 6px;
  }
`;

const Error = ({ error }) => {
  const router = useRouter();

  return (
    <ErrorStyles>
      <Head title="GitStats" />
      <Corner />
      <Octicon icon={Bug} size="large" />
      <h1>GitStats</h1>

      {error && (
        <div>
          {error.type === 403 ? (
            <p>
              Oh no, you hit the{' '}
              <a
                href="https://developer.github.com/v3/rate_limit/"
                target="_blank"
                rel="noopener noreferrer">
                rate limit
              </a>
              ! Try again later.
            </p>
          ) : error.type === 404 ? (
            <p>User not found!</p>
          ) : (
            <p>Oh no! Something went wrong. Try again later!</p>
          )}
        </div>
      )}

      <button type="button" onClick={() => router.push('/')}>
        Home ▲
      </button>
    </ErrorStyles>
  )
};

Error.propTypes = {
  error: PropTypes.object.isRequired,
};

export default Error;
