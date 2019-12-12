import { ClassType, ObjectType, Field, Int } from 'type-graphql';

export default function SearchPayload<TItem>(TItemClass: ClassType<TItem>) {
  @ObjectType(`Search${TItemClass.name}Payload`)
  class SearchPayloadClass {
    @Field(type => Int)
    totalCount: number;
    @Field(type => [TItemClass], { nullable: true })
    edges: TItem[];
  }
  return SearchPayloadClass;
}
