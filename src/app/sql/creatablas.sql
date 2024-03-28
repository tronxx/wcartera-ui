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
	ultmod		timestamp,
	primary key (idkdx)
	
);

create table exist (
	idexist		integer not null autoincrement,
	idalmacen	integer not null,
	idcodigo	integer not null,
	inicial		integer,
	entran		integer,
	salen		integer,
	exist		integer,
	ultfol		integer,
	cia		integer,
	ultmod		timestamp,
	primary key (idexist)
);


create table series (
	idserie		integer not null autoincrement,
	serie		varchar(100)
);


commit work;
