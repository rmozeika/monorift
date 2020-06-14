-- Table: public.members

-- DROP TABLE public.members;

CREATE TABLE public.members
(
    uid integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    gid integer NOT NULL DEFAULT nextval('members_gid_seq'::regclass),
    oauth_id text COLLATE pg_catalog."default",
    CONSTRAINT members_uid_gid_key UNIQUE (uid, gid),
    CONSTRAINT gid FOREIGN KEY (gid)
        REFERENCES public.groups (gid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT oauth_id FOREIGN KEY (oauth_id)
        REFERENCES public.users (oauth_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT uid FOREIGN KEY (uid)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.members
    OWNER to "Bobby";