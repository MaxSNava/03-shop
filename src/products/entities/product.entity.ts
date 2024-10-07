// Representacion de una tabla
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { ProductImage } from "./product-image.entity";
import { User } from "../../auth/entities/user.entity";

@Entity('products')
export class Product {

  @ApiProperty({
    example: '3535a8d5-dd1d-44f9-bcee-fb0db1ec127e',
    description: 'Identificador unico del producto',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Camisa de vestir',
    description: 'Nombre del producto',
    uniqueItems: true
  })
  @Column({
    type: 'text',
    unique: true
  })
  title: string;

  @ApiProperty({
    example: 100.00,
    description: 'Precio del producto',
    type: 'float'
  })
  @Column({
    type: 'float',
    default: 0
  })
  price: number;

  @ApiProperty({
    example: 'Camisa de vestir color azul con botones',
    description: 'Descripcion del producto',
  })
  @Column({
    type: 'text',
    nullable: true
  })
  description: string;

  @ApiProperty({
    example: 'camisa_de_vestir',
    description: 'Slug del producto',
    uniqueItems: true
  })
  @Column({
    type: 'text',
    unique: true
  })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Cantidad de productos en stock',
    default: 0
  })
  @Column({
    type: 'int',
    default: 0
  })
  stock: number;

  @ApiProperty()
  @Column({
    type: 'text',
    array: true
  })
  sizes: string[];

  @ApiProperty()
  @Column({
    type: 'text'
  })
  gender: string;

  @ApiProperty()
  @Column({
    type: 'text',
    array: true,
    default: []
  })
  tags: string[];

  // Relacion uno a muchos
  @ApiProperty()
  @OneToMany(
    () => ProductImage,
    (productImage) => productImage.product,
    {cascade: true, eager: true}
  )
  images?: ProductImage[];

  // Relacion muchos a uno
  @ManyToOne(
    () => User,
    (user) => user.product,
    {eager: true}
  )
  user: User;

  // -- 
  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) this.slug = this.title;
    this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'",'');
  }

  // --
  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'",'');
  }
}