create table kardex (
	idkdx		integer not null auto_increment,
	idalmacen	integer not null,
	idcodigo	integer not null,
	fecha		date,
	entosal		integer,
	folio		integer,
	idserie		integer,
	almprocede	integer,
	folioprocede	integer,
	docprocede	integer,
	tipodocentrada		integer,
	concepto	varchar(100),
	almdestino	integer,
	foliodestino	integer,
	docsalida	integer,
	tipodocsalida	integer,
	fechsale	date,
	cantidad	integer,
	cia		integer,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	primary key (idkdx)
	
);

create table exist (
	idexist		integer not null auto_increment,
	idalmacen	integer not null,
	idcodigo	integer not null,
	inicial		integer,
	entran		integer,
	salen		integer,
	exist		integer,
	ultfol		integer,
	cia		integer,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	primary key (idexist)
);


create table series (
	idserie		integer not null auto_increment,
	serie		varchar(100) unique,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	primary key (idserie)

);

create table almacen (
	idalmacen integer not null auto_increment,
	codigo		varchar(4),
	nombre		varchar(50),
	cia			integer,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  	primary key (idalmacen)
);

commit work;

