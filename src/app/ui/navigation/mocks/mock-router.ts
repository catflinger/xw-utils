export class MockRouter {

    public route: string[];

    public navigate(route: string[]): Promise<boolean> {
        this.route = route;
        console.log("navigating to " + route.join());
        return Promise.resolve(true);
    }

}