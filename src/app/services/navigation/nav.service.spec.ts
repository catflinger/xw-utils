import { TestBed } from '@angular/core/testing';
import { NavService } from './nav.service';
import { MockRouter } from './mocks/mock-router';
import { Router } from '@angular/router';
import { NavProcessor, NavTrack } from './interfaces';

//let mockTokeniser: MockTokeniserService = new MockTokeniserService();
let mockRouter = new MockRouter();


class TestProcessor implements NavProcessor<string> {
    exec(processName: string, appData: string): Promise<string> {
        
        switch (processName) {
            case "Pa":
                return Promise.resolve("a");
        };
    }
}

describe('Navigation Service', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        const service: NavService<string> = new NavService<string>(<unknown>mockRouter as Router, [], new TestProcessor());
        expect(service).toBeTruthy();
    });

    it('should begin a route', async () => {
        const service: NavService<string> = new NavService<string>(<unknown>mockRouter as Router, [simpleTrack], new TestProcessor());
        await service.beginTrack("simpleTrack", null);
        expect(mockRouter.route.join()).toEqual("route-A");
    });

    it('should navigate to next page', async () => {
        const service: NavService<string> = new NavService<string>(<unknown>mockRouter as Router, [simpleTrack], new TestProcessor());
        await service.beginTrack("simpleTrack", null);
        expect(mockRouter.route.join()).toEqual("route-A");
        await service.navigate("ok");
        expect(mockRouter.route.join()).toEqual("route-B");
    });

    it('should run a process', async () => {
        const service: NavService<string> = new NavService<string>(<unknown>mockRouter as Router, [trackWithProcess], new TestProcessor());
        await service.beginTrack("trackWithProcess", null);
        expect(mockRouter.route.join()).toEqual("route-A");
        await service.navigate("ok");
        expect(mockRouter.route.join()).toEqual("route-C");
    });

});

const simpleTrack: NavTrack = {
    name: "simpleTrack",
    start: "A",
    nodes: [
        {
            name: "A",
            type: "route",
            route: "route-A",
            actions: {
                "ok": "B"
            }
        },
        {
            name: "B",
            type: "route",
            route: "route-B",
            actions: {
                "ok": "A"
            }
        },
    ]
} 

const trackWithProcess: NavTrack = {
    name: "trackWithProcess",
    start: "A",
    nodes: [
        {
            name: "A",
            type: "route",
            route: "route-A",
            actions: {
                "ok": "B"
            }
        },
        {
            name: "B",
            type: "process",
            process: "Pa",
            actions: {
                "a": "C"
            }
        },
        {
            name: "C",
            type: "route",
            route: "route-C",
            actions: {}
        },
    ]
} 
