export interface Providers {
    status:    boolean;
    providers: Provider[];
}

export interface GetProvider {
  status:   boolean;
  message:  string;
  provider: Provider;
}

export interface Provider {
    id:         number;
    nombre:     string;
    rfc:        string;
    created_at: Date;
    updated_at: Date;
}

