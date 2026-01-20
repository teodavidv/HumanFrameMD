/*Copyright (c) 2020 Jason Zissman
Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

class TimeMe {
    constructor() {
        if (TimeMe.instance) {
            return TimeMe.instance
        }

        this.idleTimeoutMs = 30 * 1000;
        this.currentIdleTimeMs = 0;
        this.checkIdleStateRateMs = 250;
        this.isUserCurrentlyOnPage = true;
        this.isUserCurrentlyIdle = false;
        this.currentPageName = "default-page-name";

        this.visibilityChangeEventName = undefined;
        this.hiddenPropName = undefined;

        this.initialize = this.initialize.bind(this);
        this.triggerUserHasLeftThePage = this.triggerUserHasLeftThePage.bind(this);
        this.triggerUserHasGoneIdle = this.triggerUserHasGoneIdle.bind(this);

        TimeMe.instance = this;
    }

    startTimer(pageName, startTime) {
        if (!pageName) {
            pageName = this.currentPageName;
        }
        let startStopTimes = localStorage.getItem('startStopTimes') || '{}';
        startStopTimes = JSON.parse(startStopTimes);
        if (startStopTimes[pageName] === undefined) {
            startStopTimes[pageName] = [];
        } else {
            let arrayOfTimes = startStopTimes[pageName];
            let latestStartStopEntry = arrayOfTimes[arrayOfTimes.length - 1];
            if (latestStartStopEntry !== undefined && latestStartStopEntry.stopTime === undefined) {
                // Can't start a new timer until the previous one finishes.
                return;
            }
        }
        startStopTimes[pageName].push({
            "startTime": startTime || new Date(),
            "stopTime": undefined
        });
        localStorage.setItem('startStopTimes', JSON.stringify(startStopTimes));
    }

    stopTimer(pageName, stopTime) {
        if (!pageName) {
            pageName = this.currentPageName;
        }

        let startStopTimes = localStorage.getItem('startStopTimes') || '{}';
        startStopTimes = JSON.parse(startStopTimes);
        let arrayOfTimes = startStopTimes[pageName];
        if (arrayOfTimes === undefined || arrayOfTimes.length === 0) {
            // Can't stop timer before you've started it.
            return;
        }
        if (arrayOfTimes[arrayOfTimes.length - 1].stopTime === undefined) {
            arrayOfTimes[arrayOfTimes.length - 1].stopTime = stopTime || new Date();
        }
        startStopTimes[pageName] = arrayOfTimes;
        localStorage.setItem('startStopTimes', JSON.stringify(startStopTimes));
    }

    stopAllTimers() {
        let startStopTimes = localStorage.getItem('startStopTimes') || '{}';
        startStopTimes = JSON.parse(startStopTimes);
        let pageNames = Object.keys(startStopTimes);
        for (let i = 0; i < pageNames.length; i++) {
            this.stopTimer(pageNames[i]);
        }
    }

    getTimeOnCurrentPageInSeconds() {
        return this.getTimeOnPageInSeconds(this.currentPageName);
    }

    getTimeOnPageInSeconds(pageName) {
        const timeInMs = this.getTimeOnPageInMilliseconds(pageName);
        if (timeInMs === undefined) {
            return undefined;
        } else {
            return timeInMs / 1000;
        }
    }

    getTimeOnCurrentPageInMilliseconds() {
        return this.getTimeOnPageInMilliseconds(this.currentPageName);
    }

    getTimeOnPageInMilliseconds(pageName) {
        let totalTimeOnPage = 0;
        let startStopTimes = localStorage.getItem('startStopTimes') || '{}';
        startStopTimes = JSON.parse(startStopTimes);
        const arrayOfTimes = startStopTimes[pageName];
        if (arrayOfTimes === undefined) {
            // Can't get time on page before you've started the timer.
            return;
        }

        let timeSpentOnPageInSeconds = 0;
        for (let i = 0; i < arrayOfTimes.length; i++) {
            const startTime = arrayOfTimes[i].startTime;
            let stopTime = arrayOfTimes[i].stopTime;
            if (stopTime === undefined) {
                stopTime = new Date();
            }
            const difference = Date.parse(stopTime) - Date.parse(startTime);
            timeSpentOnPageInSeconds += difference;
        }
        totalTimeOnPage = Number(timeSpentOnPageInSeconds);
        return totalTimeOnPage;
    }

    getTimeOnAllPagesInSeconds() {
        let allTimes = [];
        let startStopTimes = localStorage.getItem('startStopTimes') || '{}';
        startStopTimes = JSON.parse(startStopTimes);
        let pageNames = Object.keys(startStopTimes);
        for (let i = 0; i < pageNames.length; i++) {
            let pageName = pageNames[i];
            let timeOnPage = this.getTimeOnPageInSeconds(pageName);
            allTimes.push({
                "pageName": pageName,
                "timeOnPage": timeOnPage
            });
        }
        return allTimes;
    }

    setIdleDurationInSeconds(duration) {
        let durationFloat = parseFloat(duration);
        if (isNaN(durationFloat) === false) {
            this.idleTimeoutMs = duration * 1000;
        } else {
            throw {
                name: "InvalidDurationException",
                message: "An invalid duration time (" + duration + ") was provided."
            };
        }
    }

    setCurrentPageName(pageName) {
        this.currentPageName = pageName;
    }

    triggerUserHasGoneIdle() {
        if (this.isUserCurrentlyOnPage) {
            this.isUserCurrentlyOnPage = false;
            let userLeftCallbacks = localStorage.getItem('userLeftCallbacks') || '[]';
            userLeftCallbacks = JSON.parse(userLeftCallbacks);
            for (let i = 0; i < userLeftCallbacks.length; i++) {
                let userHasLeftCallback = userLeftCallbacks[i];
                let numberTimes = userHasLeftCallback.numberOfTimesToInvoke;
                if (isNaN(numberTimes) || (numberTimes === undefined) || numberTimes > 0) {
                    userHasLeftCallback.numberOfTimesToInvoke -= 1;
                    userHasLeftCallback.callback();
                }
                userLeftCallbacks[i] = userHasLeftCallback;
            }
            localStorage.setItem('userLeftCallbacks', JSON.stringify(userLeftCallbacks));
        }
        this.stopAllTimers();
    }

    triggerUserHasLeftThePage(pageUnload = false) {
        let pageViewEvents = localStorage.getItem('pageViewEvents') || '{}';
        pageViewEvents = JSON.parse(pageViewEvents);
        const expireTime = pageViewEvents['expireTime'];
        const currentTimestamp = new Date().getTime();

        if (Object.keys(pageViewEvents) === 0) {
            // no page view events yet
            return;
        }

        // Set time_spent for all page view events before sending
        for (const key of Object.keys(pageViewEvents)) {
            if (typeof pageViewEvents[key] === "object" && pageViewEvents[key] !== null && !Array.isArray(pageViewEvents[key])) {
                pageViewEvents[key].time_spent = this.getTimeOnPageInSeconds(key);
            }
        }

        // Filter out invalid values
        const filteredPageViewEvents = Object.values(pageViewEvents).filter(value =>
            typeof value === "object" && value !== null && !Array.isArray(value)
        );

        const body = {
            request: encrypt(filteredPageViewEvents)
        };

        const fetch_init = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-api-key': 'ASNK5ikSal2KNZTqNBxIT7bUb84PDaOY5oAkH2G5',
                'x-yotpo-client': 'shopify-web-pixel',
            },
            method: 'POST',
            cache: 'no-cache',
            body: JSON.stringify(body),
            keepalive: true,
            mode: 'cors'
        };

        fetch('https://web-tracker.smsbump.com', fetch_init).then(resp => {

        }).then().catch(e => {
            console.log({ status: 'error', message: 'Something went wrong', error: e })
        });

        // Cleanup the localStorage items
        if (pageUnload || (expireTime !== undefined && currentTimestamp > expireTime)) {
            deleteAllData();
        } else {
            this.stopAllTimers();
        }
    }

    listenForVisibilityEvents(trackWhenUserLeavesPage, trackWhenUserGoesIdle) {
        if (trackWhenUserLeavesPage) {
            this.listenForUserLeavesOrReturnsEvents();
        }

        if (trackWhenUserGoesIdle) {
            this.listForIdleEvents();
        }
    }

    listenForUserLeavesOrReturnsEvents() {
        if (typeof document !== 'undefined') {
            if (typeof document.hidden !== "undefined") {
                this.hiddenPropName = "hidden";
                this.visibilityChangeEventName = "visibilitychange";
            } else if (typeof document.mozHidden !== "undefined") {
                this.hiddenPropName = "mozHidden";
                this.visibilityChangeEventName = "mozvisibilitychange";
            } else if (typeof document.msHidden !== "undefined") {
                this.hiddenPropName = "msHidden";
                this.visibilityChangeEventName = "msvisibilitychange";
            } else if (typeof document.webkitHidden !== "undefined") {
                this.hiddenPropName = "webkitHidden";
                this.visibilityChangeEventName = "webkitvisibilitychange";
            }

            let isNavigatingAway = false;
            let hasSentLeaveRequest = false; // Prevent duplicate API calls

            // Track link clicks and button clicks (to detect navigation)
            document.addEventListener("click", (event) => {
                if (event.target.tagName === "A" || event.target.closest("a") || event.target.tagName === "BUTTON") {
                    isNavigatingAway = true;
                }
            });

            // Detect form submissions (navigation events)
            document.addEventListener("submit", () => {
                isNavigatingAway = true;
            });

            // Handle beforeunload (detects tab/browser close or reload)
            window.addEventListener("beforeunload", (event) => {
                if (!isNavigatingAway && !hasSentLeaveRequest) {
                    hasSentLeaveRequest = true; // Prevent duplicate API calls
                    TimeMe.instance.triggerUserHasLeftThePage(true);
                }
            });

            // Handle visibility change (detects tab switch, mobile backgrounding)
            document.addEventListener("visibilitychange", () => {
                if (document.visibilityState === "hidden") {
                    TimeMe.instance.triggerUserHasGoneIdle(); // User has gone idle
                } else {
                    TimeMe.instance.triggerUserHasReturned(); // User has returned to the tab
                }
            });

            // Detect when the browser suspends JavaScript execution (mainly for mobile users)
            window.addEventListener("pageshow", function(event) {
                if (event.persisted) {
                    TimeMe.instance.triggerUserHasReturned();
                } else if (performance.navigation.type === 1) {
                    // TODO..
                }
            });

            // Track user inactivity (stop tracking after 30 seconds of inactivity)
            let idleTimeout;
            function resetIdleTimer() {
                clearTimeout(idleTimeout);
                idleTimeout = setTimeout(() => {
                    TimeMe.instance.triggerUserHasGoneIdle();
                }, 30000); // 30 sec timeout
            }

            ["mousemove", "keydown", "touchstart"].forEach(event => {
                document.addEventListener(event, resetIdleTimer);
            });

            // Handle when user switches apps (track lost focus)
            window.addEventListener('blur', () => {
                TimeMe.instance.triggerUserHasGoneIdle();
            });

            // Handle when user returns focus
            window.addEventListener('focus', () => {
                TimeMe.instance.triggerUserHasReturned();
            });
        }
    }

    userActivityDetected() {
        if (this.isUserCurrentlyIdle) {
            this.triggerUserHasReturned();
        }
        this.resetIdleCountdown();
    }

    resetIdleCountdown() {
        this.isUserCurrentlyIdle = false;
        this.currentIdleTimeMs = 0;
    }

    callWhenUserLeaves(callback, numberOfTimesToInvoke) {
        let userLeftCallbacks = localStorage.getItem('userLeftCallbacks') || '[]';
        userLeftCallbacks = JSON.parse(userLeftCallbacks);
        userLeftCallbacks.push({
            callback: callback,
            numberOfTimesToInvoke: numberOfTimesToInvoke
        })
        localStorage.setItem('userLeftCallbacks', JSON.stringify(userLeftCallbacks));
    }

    callWhenUserReturns(callback, numberOfTimesToInvoke) {
        let userReturnCallbacks = localStorage.getItem('userReturnCallbacks') || '[]';
        userReturnCallbacks = JSON.parse(userReturnCallbacks);
        userReturnCallbacks.push({
            callback: callback,
            numberOfTimesToInvoke: numberOfTimesToInvoke
        })
        localStorage.setItem('userReturnCallbacks', JSON.stringify(userReturnCallbacks));
    }

    triggerUserHasReturned() {
        if (!this.isUserCurrentlyOnPage) {
            this.isUserCurrentlyOnPage = true;
            this.resetIdleCountdown();
            let userReturnCallbacks = localStorage.getItem('userReturnCallbacks') || '[]';
            userReturnCallbacks = JSON.parse(userReturnCallbacks);
            for (let i = 0; i < userReturnCallbacks.length; i++) {
                let userReturnedCallback = userReturnCallbacks[i];
                let numberTimes = userReturnedCallback.numberOfTimesToInvoke;
                if (isNaN(numberTimes) || (numberTimes === undefined) || numberTimes > 0) {
                    userReturnedCallback.numberOfTimesToInvoke -= 1;
                    userReturnedCallback.callback();
                }
                userReturnCallbacks[i] = userReturnedCallback;
                localStorage.setItem('userReturnCallbacks', JSON.stringify(userReturnCallbacks));
            }
        }
        this.startTimer();
    }

    callAfterTimeElapsedInSeconds(timeInSeconds, callback) {
        let timeElapsedCallbacks = localStorage.getItem('timeElapsedCallbacks') || '[]';
        timeElapsedCallbacks = JSON.parse(timeElapsedCallbacks);
        timeElapsedCallbacks.push({
            timeInSeconds: timeInSeconds,
            callback: callback,
            pending: true
        });

        localStorage.setItem('timeElapsedCallbacks', JSON.stringify(timeElapsedCallbacks));

    }

    checkIdleState() {
        let timeElapsedCallbacks = localStorage.getItem('timeElapsedCallbacks') || '{}';
        timeElapsedCallbacks = JSON.parse(timeElapsedCallbacks);
        for (let i = 0; i < timeElapsedCallbacks.length; i++) {
            if (timeElapsedCallbacks[i].pending && this.getTimeOnCurrentPageInSeconds() >timeElapsedCallbacks[i].timeInSeconds) {
                timeElapsedCallbacks[i].callback();
                timeElapsedCallbacks[i].pending = false;
            }
        }
        localStorage.setItem('timeElapsedCallbacks', JSON.stringify(timeElapsedCallbacks));
        if (this.isUserCurrentlyIdle === false && this.currentIdleTimeMs > this.idleTimeoutMs) {
            this.isUserCurrentlyIdle = true;
            TimeMe.instance.triggerUserHasGoneIdle();
        } else {
            this.currentIdleTimeMs += this.checkIdleStateRateMs;
        }
    }

    listForIdleEvents() {
        if (typeof document !== 'undefined') {
            document.addEventListener("mousemove", () => {
                TimeMe.instance.userActivityDetected();
            });
            document.addEventListener("keyup", () => {
                TimeMe.instance.userActivityDetected();
            });
            document.addEventListener("touchstart", () => {
                TimeMe.instance.userActivityDetected();
            });
            window.addEventListener("scroll", () => {
                TimeMe.instance.userActivityDetected();
            });

            setInterval(() => {
                if (this.isUserCurrentlyIdle !== true) {
                    TimeMe.instance.checkIdleState();
                }
            }, this.checkIdleStateRateMs);
        }
    }

    initialize(options) {
        let idleTimeoutInSeconds = this.idleTimeoutMs || 30;
        let currentPageName = this.currentPageName || "default-page-name";
        let initialStartTime = undefined;
        let trackWhenUserLeavesPage = true;
        let trackWhenUserGoesIdle = true;

        if (options) {
            idleTimeoutInSeconds = options.idleTimeoutInSeconds || idleTimeoutInSeconds;
            currentPageName = options.currentPageName || currentPageName;
            initialStartTime = options.initialStartTime;

            if (options.trackWhenUserLeavesPage === false) {
                trackWhenUserLeavesPage = false;
            }
            if (options.trackWhenUserGoesIdle === false) {
                trackWhenUserGoesIdle = false;
            }
        }

        this.setIdleDurationInSeconds(idleTimeoutInSeconds)
        this.setCurrentPageName(currentPageName)
        this.listenForVisibilityEvents(trackWhenUserLeavesPage, trackWhenUserGoesIdle);

        // TODO - only do this if page currently visible.
        if (document.visibilityState === 'visible') {
            this.startTimer(undefined, initialStartTime);
        }
    }
}


let timer = new TimeMe();
let current_page_identifier = btoa(document.location.href.split('#')[0]);

timer.initialize({
    currentPageName: current_page_identifier, // current page
    idleTimeoutInSeconds: 30 // seconds
});

function encrypt(payload) {
    let payload_json = JSON.stringify(payload)
    let payload_encoded = btoa(payload_json)

    let payload_first_part = payload_encoded.substring(0, 10)
    let request_encoded = payload_encoded.substring(10)
    let random_char = generateRandomString(1)
    let random_chars = chunk(payload_first_part, 3).join(random_char)

    return random_chars + request_encoded
}

function generateRandomString(length = 40) {
    let result = ''
    let characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let characters_length = characters.length

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters_length))
    }

    return result
}


function chunk(string, n) {
    let text = []
    let i
    let len

    for (i = 0, len = string.length; i < len; i += n) {
        text.push(string.substr(i, n))
    }

    return text
}

function deleteAllData()
{
    localStorage.removeItem('startStopTimes');
    localStorage.removeItem('timeElapsedCallbacks');
    localStorage.removeItem('userReturnCallbacks');
    localStorage.removeItem('userLeftCallbacks');
    localStorage.removeItem('pageViewEvents');
}
