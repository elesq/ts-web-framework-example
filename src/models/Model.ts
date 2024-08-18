import { AxiosPromise, AxiosResponse } from 'axios';
import { Callback } from './Callback';
import { GuaranteedToHaveId } from './GuaranteedToHaveId';

interface ModelAttributes<T> {
    set(value: T): void;
    getAll(): T;
    get<K extends keyof T>(key: K): T[K];
}

interface Sync<T> {
    fetch(id: number): AxiosPromise;
    save(data: T): AxiosPromise;
}

interface Events {
    on(eventName: string, callback: Callback): void;
    trigger(eventName: string): void;
}

export class Model<T extends GuaranteedToHaveId> {
    constructor(
        private attributes: ModelAttributes<T>,
        private events: Events,
        private sync: Sync<T>
    ) {}

    on = this.events.on;
    get = this.attributes.get;
    trigger = this.events.trigger;

    set(update: T): void {
        this.attributes.set(update);
        this.events.trigger('change');
    }

    fetch(): void {
        const id = this.get('id');

        if (typeof id !== 'number') {
            throw new Error('cannot fetch without id');
        }

        this.sync.fetch(id).then((res: AxiosResponse): void => {
            this.set(res.data);
        });
    }

    save(): void {
        this.sync
            .save(this.attributes.getAll())
            .then((res: AxiosResponse): void => {
                this.trigger('save');
            })
            .catch(() => {
                this.trigger('error');
            });
    }
}
