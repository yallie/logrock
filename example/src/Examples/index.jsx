import React, { Component } from 'react';
import dayjs from 'dayjs';
import platform from 'platform';
import isMobile from 'is-mobile';
import logger, { LoggerContainer } from '../../../src';
const { name, os, version } = platform;
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

global.sessionID = `sessionid-${Math.random().toString(36).substr(3, 9)}`;

export default class Example extends Component {
    showMessage(level, message, important) {
        console[level](message);

        const notificatorTypes = {
            log: 'success',
            info: 'success',
            error: 'error',
            debug: 'warn',
            warn: 'warn'
        };
        if (important &&
            notificatorTypes[level] &&
            toast[notificatorTypes[level]]) {
            toast[notificatorTypes[level]](message);
        }
    }
    render() {
        return <>
            <h3 id="example">Example</h3>
            <p style={{fontSize: '17px'}}>
                This is a simple example with using all of callbacks and settings. See code <a href="https://github.com/AlexSergey/logrock/blob/master/example/src/Examples/index.jsx" target="_blank">here</a>!
            </p>
            <LoggerContainer
                sessionID={global.sessionID}
                limit={75}
                getCurrentDate={() => {
                    return dayjs().format('YYYY-MM-DD HH:mm:ss');
                }}
                stdout={this.showMessage}
                onError={(stackData) => {
                    console.log(stackData);
                }}
                onPrepareStack={stack => {
                    const BROWSER = `${name} ${version}`;
                    const OS = `${os.family} ${os.architecture}-bit`;

                    let screen = global.screen
                        ? Object.assign(
                            {},
                            {
                                width: global.screen.width,
                                height: global.screen.height,
                                colorDepth: global.screen.colorDepth,
                                pixelDepth: global.screen.pixelDepth
                            },
                            !!global.screen.orientation ? { orientation: global.screen.orientation.type } : {}
                        )
                        : {};

                    let device = isMobile()
                        ? {
                            type: platform.product,
                            description: platform.description,
                            ua: platform.ua
                        }
                        : {
                            type: 'pc',
                            description: platform.description,
                            ua: platform.ua
                        };

                    stack.screen = screen;
                    stack.device = device;
                    stack.env.browser = BROWSER;
                    stack.env.os = OS;
                }}
            >
                <>
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss={false}
                        draggable
                        pauseOnHover
                        key="notification"
                    />
                    <div>
                        <table className="table" style={{textAlign: 'center'}}>
                            <tbody>
                                <tr>
                                    <td>
                                        <p style={{fontSize: '16px'}}><strong>logger.log</strong></p>
                                        <button className="btn btn-primary mb-2" onClick={() => logger.log('module|test log', true)}>
                                            log
                                        </button>
                                    </td>
                                    <td>
                                        <p style={{fontSize: '16px'}}><strong>logger.info</strong></p>
                                        <button className="btn btn-info mb-2" onClick={() => logger.info('module|test info', true)}>
                                            info
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p style={{fontSize: '16px'}}><strong>logger.debug</strong></p>
                                        <button className="btn btn-default mb-2" style={{backgroundColor: '#dedede', backgroundImage: 'none'}} onClick={() => logger.debug('module|test debug', true)}>
                                            debug
                                        </button>
                                    </td>
                                    <td>
                                        <p style={{fontSize: '16px'}}><strong>logger.warn</strong></p>
                                        <button className="btn btn-warning mb-2" onClick={() => logger.warn('module|test warn', true)}>
                                            warn
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p style={{fontSize: '16px'}}><strong>logger.error</strong></p>
                                        <button className="btn btn-danger mb-2" onClick={() => logger.error('module|test error', true)}>
                                            error
                                        </button>
                                    </td>
                                    <th>
                                        <h3>onError callback</h3>
                                        <button className="btn btn-primary mb-2" onClick={() => blabla()}>
                                            FATAL ERROR!
                                        </button>
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </>
            </LoggerContainer>
        </>;
    }
}
