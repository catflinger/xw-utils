export class MockRouter {

    public route: string[];

    public navigate(route: string[]): Promise<boolean> {
        this.route = route;
        return Promise.resolve(true);
    }

}