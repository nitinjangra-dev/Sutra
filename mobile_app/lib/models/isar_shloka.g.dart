// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'isar_shloka.dart';

// **************************************************************************
// IsarCollectionGenerator
// **************************************************************************

// coverage:ignore-file
// ignore_for_file: duplicate_ignore, non_constant_identifier_names, constant_identifier_names, invalid_use_of_protected_member, unnecessary_cast, prefer_const_constructors, lines_longer_than_80_chars, require_trailing_commas, inference_failure_on_function_invocation, unnecessary_parenthesis, unnecessary_raw_strings, unnecessary_null_checks, join_return_with_assignment, prefer_final_locals, avoid_js_rounded_ints, avoid_positional_boolean_parameters, always_specify_types

extension GetIsarShlokaCollection on Isar {
  IsarCollection<IsarShloka> get isarShlokas => this.collection();
}

const IsarShlokaSchema = CollectionSchema(
  name: r'IsarShloka',
  id: 2573793438680086957,
  properties: {
    r'author': PropertySchema(
      id: 0,
      name: r'author',
      type: IsarType.string,
    ),
    r'category': PropertySchema(
      id: 1,
      name: r'category',
      type: IsarType.string,
    ),
    r'hindiMeaning': PropertySchema(
      id: 2,
      name: r'hindiMeaning',
      type: IsarType.string,
    ),
    r'isViral': PropertySchema(
      id: 3,
      name: r'isViral',
      type: IsarType.bool,
    ),
    r'likesCount': PropertySchema(
      id: 4,
      name: r'likesCount',
      type: IsarType.long,
    ),
    r'moodTags': PropertySchema(
      id: 5,
      name: r'moodTags',
      type: IsarType.stringList,
    ),
    r'sanskrit': PropertySchema(
      id: 6,
      name: r'sanskrit',
      type: IsarType.string,
    ),
    r'section': PropertySchema(
      id: 7,
      name: r'section',
      type: IsarType.string,
    ),
    r'shlokaId': PropertySchema(
      id: 8,
      name: r'shlokaId',
      type: IsarType.string,
    ),
    r'source': PropertySchema(
      id: 9,
      name: r'source',
      type: IsarType.string,
    )
  },
  estimateSize: _isarShlokaEstimateSize,
  serialize: _isarShlokaSerialize,
  deserialize: _isarShlokaDeserialize,
  deserializeProp: _isarShlokaDeserializeProp,
  idName: r'id',
  indexes: {
    r'shlokaId': IndexSchema(
      id: 6407147462681508635,
      name: r'shlokaId',
      unique: true,
      replace: true,
      properties: [
        IndexPropertySchema(
          name: r'shlokaId',
          type: IndexType.hash,
          caseSensitive: true,
        )
      ],
    )
  },
  links: {},
  embeddedSchemas: {},
  getId: _isarShlokaGetId,
  getLinks: _isarShlokaGetLinks,
  attach: _isarShlokaAttach,
  version: '3.1.0+1',
);

int _isarShlokaEstimateSize(
  IsarShloka object,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  var bytesCount = offsets.last;
  bytesCount += 3 + object.author.length * 3;
  bytesCount += 3 + object.category.length * 3;
  bytesCount += 3 + object.hindiMeaning.length * 3;
  bytesCount += 3 + object.moodTags.length * 3;
  {
    for (var i = 0; i < object.moodTags.length; i++) {
      final value = object.moodTags[i];
      bytesCount += value.length * 3;
    }
  }
  {
    final value = object.sanskrit;
    if (value != null) {
      bytesCount += 3 + value.length * 3;
    }
  }
  bytesCount += 3 + object.section.length * 3;
  bytesCount += 3 + object.shlokaId.length * 3;
  bytesCount += 3 + object.source.length * 3;
  return bytesCount;
}

void _isarShlokaSerialize(
  IsarShloka object,
  IsarWriter writer,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  writer.writeString(offsets[0], object.author);
  writer.writeString(offsets[1], object.category);
  writer.writeString(offsets[2], object.hindiMeaning);
  writer.writeBool(offsets[3], object.isViral);
  writer.writeLong(offsets[4], object.likesCount);
  writer.writeStringList(offsets[5], object.moodTags);
  writer.writeString(offsets[6], object.sanskrit);
  writer.writeString(offsets[7], object.section);
  writer.writeString(offsets[8], object.shlokaId);
  writer.writeString(offsets[9], object.source);
}

IsarShloka _isarShlokaDeserialize(
  Id id,
  IsarReader reader,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  final object = IsarShloka();
  object.author = reader.readString(offsets[0]);
  object.category = reader.readString(offsets[1]);
  object.hindiMeaning = reader.readString(offsets[2]);
  object.id = id;
  object.isViral = reader.readBool(offsets[3]);
  object.likesCount = reader.readLong(offsets[4]);
  object.moodTags = reader.readStringList(offsets[5]) ?? [];
  object.sanskrit = reader.readStringOrNull(offsets[6]);
  object.section = reader.readString(offsets[7]);
  object.shlokaId = reader.readString(offsets[8]);
  object.source = reader.readString(offsets[9]);
  return object;
}

P _isarShlokaDeserializeProp<P>(
  IsarReader reader,
  int propertyId,
  int offset,
  Map<Type, List<int>> allOffsets,
) {
  switch (propertyId) {
    case 0:
      return (reader.readString(offset)) as P;
    case 1:
      return (reader.readString(offset)) as P;
    case 2:
      return (reader.readString(offset)) as P;
    case 3:
      return (reader.readBool(offset)) as P;
    case 4:
      return (reader.readLong(offset)) as P;
    case 5:
      return (reader.readStringList(offset) ?? []) as P;
    case 6:
      return (reader.readStringOrNull(offset)) as P;
    case 7:
      return (reader.readString(offset)) as P;
    case 8:
      return (reader.readString(offset)) as P;
    case 9:
      return (reader.readString(offset)) as P;
    default:
      throw IsarError('Unknown property with id $propertyId');
  }
}

Id _isarShlokaGetId(IsarShloka object) {
  return object.id;
}

List<IsarLinkBase<dynamic>> _isarShlokaGetLinks(IsarShloka object) {
  return [];
}

void _isarShlokaAttach(IsarCollection<dynamic> col, Id id, IsarShloka object) {
  object.id = id;
}

extension IsarShlokaByIndex on IsarCollection<IsarShloka> {
  Future<IsarShloka?> getByShlokaId(String shlokaId) {
    return getByIndex(r'shlokaId', [shlokaId]);
  }

  IsarShloka? getByShlokaIdSync(String shlokaId) {
    return getByIndexSync(r'shlokaId', [shlokaId]);
  }

  Future<bool> deleteByShlokaId(String shlokaId) {
    return deleteByIndex(r'shlokaId', [shlokaId]);
  }

  bool deleteByShlokaIdSync(String shlokaId) {
    return deleteByIndexSync(r'shlokaId', [shlokaId]);
  }

  Future<List<IsarShloka?>> getAllByShlokaId(List<String> shlokaIdValues) {
    final values = shlokaIdValues.map((e) => [e]).toList();
    return getAllByIndex(r'shlokaId', values);
  }

  List<IsarShloka?> getAllByShlokaIdSync(List<String> shlokaIdValues) {
    final values = shlokaIdValues.map((e) => [e]).toList();
    return getAllByIndexSync(r'shlokaId', values);
  }

  Future<int> deleteAllByShlokaId(List<String> shlokaIdValues) {
    final values = shlokaIdValues.map((e) => [e]).toList();
    return deleteAllByIndex(r'shlokaId', values);
  }

  int deleteAllByShlokaIdSync(List<String> shlokaIdValues) {
    final values = shlokaIdValues.map((e) => [e]).toList();
    return deleteAllByIndexSync(r'shlokaId', values);
  }

  Future<Id> putByShlokaId(IsarShloka object) {
    return putByIndex(r'shlokaId', object);
  }

  Id putByShlokaIdSync(IsarShloka object, {bool saveLinks = true}) {
    return putByIndexSync(r'shlokaId', object, saveLinks: saveLinks);
  }

  Future<List<Id>> putAllByShlokaId(List<IsarShloka> objects) {
    return putAllByIndex(r'shlokaId', objects);
  }

  List<Id> putAllByShlokaIdSync(List<IsarShloka> objects,
      {bool saveLinks = true}) {
    return putAllByIndexSync(r'shlokaId', objects, saveLinks: saveLinks);
  }
}

extension IsarShlokaQueryWhereSort
    on QueryBuilder<IsarShloka, IsarShloka, QWhere> {
  QueryBuilder<IsarShloka, IsarShloka, QAfterWhere> anyId() {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(const IdWhereClause.any());
    });
  }
}

extension IsarShlokaQueryWhere
    on QueryBuilder<IsarShloka, IsarShloka, QWhereClause> {
  QueryBuilder<IsarShloka, IsarShloka, QAfterWhereClause> idEqualTo(Id id) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IdWhereClause.between(
        lower: id,
        upper: id,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterWhereClause> idNotEqualTo(Id id) {
    return QueryBuilder.apply(this, (query) {
      if (query.whereSort == Sort.asc) {
        return query
            .addWhereClause(
              IdWhereClause.lessThan(upper: id, includeUpper: false),
            )
            .addWhereClause(
              IdWhereClause.greaterThan(lower: id, includeLower: false),
            );
      } else {
        return query
            .addWhereClause(
              IdWhereClause.greaterThan(lower: id, includeLower: false),
            )
            .addWhereClause(
              IdWhereClause.lessThan(upper: id, includeUpper: false),
            );
      }
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterWhereClause> idGreaterThan(Id id,
      {bool include = false}) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(
        IdWhereClause.greaterThan(lower: id, includeLower: include),
      );
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterWhereClause> idLessThan(Id id,
      {bool include = false}) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(
        IdWhereClause.lessThan(upper: id, includeUpper: include),
      );
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterWhereClause> idBetween(
    Id lowerId,
    Id upperId, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IdWhereClause.between(
        lower: lowerId,
        includeLower: includeLower,
        upper: upperId,
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterWhereClause> shlokaIdEqualTo(
      String shlokaId) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IndexWhereClause.equalTo(
        indexName: r'shlokaId',
        value: [shlokaId],
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterWhereClause> shlokaIdNotEqualTo(
      String shlokaId) {
    return QueryBuilder.apply(this, (query) {
      if (query.whereSort == Sort.asc) {
        return query
            .addWhereClause(IndexWhereClause.between(
              indexName: r'shlokaId',
              lower: [],
              upper: [shlokaId],
              includeUpper: false,
            ))
            .addWhereClause(IndexWhereClause.between(
              indexName: r'shlokaId',
              lower: [shlokaId],
              includeLower: false,
              upper: [],
            ));
      } else {
        return query
            .addWhereClause(IndexWhereClause.between(
              indexName: r'shlokaId',
              lower: [shlokaId],
              includeLower: false,
              upper: [],
            ))
            .addWhereClause(IndexWhereClause.between(
              indexName: r'shlokaId',
              lower: [],
              upper: [shlokaId],
              includeUpper: false,
            ));
      }
    });
  }
}

extension IsarShlokaQueryFilter
    on QueryBuilder<IsarShloka, IsarShloka, QFilterCondition> {
  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> authorEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'author',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> authorGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'author',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> authorLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'author',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> authorBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'author',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> authorStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'author',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> authorEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'author',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> authorContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'author',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> authorMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'author',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> authorIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'author',
        value: '',
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      authorIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'author',
        value: '',
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> categoryEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'category',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      categoryGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'category',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> categoryLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'category',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> categoryBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'category',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      categoryStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'category',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> categoryEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'category',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> categoryContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'category',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> categoryMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'category',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      categoryIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'category',
        value: '',
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      categoryIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'category',
        value: '',
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      hindiMeaningEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'hindiMeaning',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      hindiMeaningGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'hindiMeaning',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      hindiMeaningLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'hindiMeaning',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      hindiMeaningBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'hindiMeaning',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      hindiMeaningStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'hindiMeaning',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      hindiMeaningEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'hindiMeaning',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      hindiMeaningContains(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'hindiMeaning',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      hindiMeaningMatches(String pattern, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'hindiMeaning',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      hindiMeaningIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'hindiMeaning',
        value: '',
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      hindiMeaningIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'hindiMeaning',
        value: '',
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> idEqualTo(
      Id value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'id',
        value: value,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> idGreaterThan(
    Id value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'id',
        value: value,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> idLessThan(
    Id value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'id',
        value: value,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> idBetween(
    Id lower,
    Id upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'id',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> isViralEqualTo(
      bool value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'isViral',
        value: value,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> likesCountEqualTo(
      int value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'likesCount',
        value: value,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      likesCountGreaterThan(
    int value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'likesCount',
        value: value,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      likesCountLessThan(
    int value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'likesCount',
        value: value,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> likesCountBetween(
    int lower,
    int upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'likesCount',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      moodTagsElementEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'moodTags',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      moodTagsElementGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'moodTags',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      moodTagsElementLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'moodTags',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      moodTagsElementBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'moodTags',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      moodTagsElementStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'moodTags',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      moodTagsElementEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'moodTags',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      moodTagsElementContains(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'moodTags',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      moodTagsElementMatches(String pattern, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'moodTags',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      moodTagsElementIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'moodTags',
        value: '',
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      moodTagsElementIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'moodTags',
        value: '',
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      moodTagsLengthEqualTo(int length) {
    return QueryBuilder.apply(this, (query) {
      return query.listLength(
        r'moodTags',
        length,
        true,
        length,
        true,
      );
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      moodTagsIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.listLength(
        r'moodTags',
        0,
        true,
        0,
        true,
      );
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      moodTagsIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.listLength(
        r'moodTags',
        0,
        false,
        999999,
        true,
      );
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      moodTagsLengthLessThan(
    int length, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.listLength(
        r'moodTags',
        0,
        true,
        length,
        include,
      );
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      moodTagsLengthGreaterThan(
    int length, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.listLength(
        r'moodTags',
        length,
        include,
        999999,
        true,
      );
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      moodTagsLengthBetween(
    int lower,
    int upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.listLength(
        r'moodTags',
        lower,
        includeLower,
        upper,
        includeUpper,
      );
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> sanskritIsNull() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(const FilterCondition.isNull(
        property: r'sanskrit',
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      sanskritIsNotNull() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(const FilterCondition.isNotNull(
        property: r'sanskrit',
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> sanskritEqualTo(
    String? value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'sanskrit',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      sanskritGreaterThan(
    String? value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'sanskrit',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> sanskritLessThan(
    String? value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'sanskrit',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> sanskritBetween(
    String? lower,
    String? upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'sanskrit',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      sanskritStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'sanskrit',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> sanskritEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'sanskrit',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> sanskritContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'sanskrit',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> sanskritMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'sanskrit',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      sanskritIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'sanskrit',
        value: '',
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      sanskritIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'sanskrit',
        value: '',
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> sectionEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'section',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      sectionGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'section',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> sectionLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'section',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> sectionBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'section',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> sectionStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'section',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> sectionEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'section',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> sectionContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'section',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> sectionMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'section',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> sectionIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'section',
        value: '',
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      sectionIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'section',
        value: '',
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> shlokaIdEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'shlokaId',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      shlokaIdGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'shlokaId',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> shlokaIdLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'shlokaId',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> shlokaIdBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'shlokaId',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      shlokaIdStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'shlokaId',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> shlokaIdEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'shlokaId',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> shlokaIdContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'shlokaId',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> shlokaIdMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'shlokaId',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      shlokaIdIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'shlokaId',
        value: '',
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      shlokaIdIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'shlokaId',
        value: '',
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> sourceEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'source',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> sourceGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'source',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> sourceLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'source',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> sourceBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'source',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> sourceStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'source',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> sourceEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'source',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> sourceContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'source',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> sourceMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'source',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition> sourceIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'source',
        value: '',
      ));
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterFilterCondition>
      sourceIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'source',
        value: '',
      ));
    });
  }
}

extension IsarShlokaQueryObject
    on QueryBuilder<IsarShloka, IsarShloka, QFilterCondition> {}

extension IsarShlokaQueryLinks
    on QueryBuilder<IsarShloka, IsarShloka, QFilterCondition> {}

extension IsarShlokaQuerySortBy
    on QueryBuilder<IsarShloka, IsarShloka, QSortBy> {
  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> sortByAuthor() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'author', Sort.asc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> sortByAuthorDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'author', Sort.desc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> sortByCategory() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'category', Sort.asc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> sortByCategoryDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'category', Sort.desc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> sortByHindiMeaning() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'hindiMeaning', Sort.asc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> sortByHindiMeaningDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'hindiMeaning', Sort.desc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> sortByIsViral() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'isViral', Sort.asc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> sortByIsViralDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'isViral', Sort.desc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> sortByLikesCount() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'likesCount', Sort.asc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> sortByLikesCountDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'likesCount', Sort.desc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> sortBySanskrit() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'sanskrit', Sort.asc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> sortBySanskritDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'sanskrit', Sort.desc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> sortBySection() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'section', Sort.asc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> sortBySectionDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'section', Sort.desc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> sortByShlokaId() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'shlokaId', Sort.asc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> sortByShlokaIdDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'shlokaId', Sort.desc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> sortBySource() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'source', Sort.asc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> sortBySourceDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'source', Sort.desc);
    });
  }
}

extension IsarShlokaQuerySortThenBy
    on QueryBuilder<IsarShloka, IsarShloka, QSortThenBy> {
  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> thenByAuthor() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'author', Sort.asc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> thenByAuthorDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'author', Sort.desc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> thenByCategory() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'category', Sort.asc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> thenByCategoryDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'category', Sort.desc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> thenByHindiMeaning() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'hindiMeaning', Sort.asc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> thenByHindiMeaningDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'hindiMeaning', Sort.desc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> thenById() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'id', Sort.asc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> thenByIdDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'id', Sort.desc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> thenByIsViral() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'isViral', Sort.asc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> thenByIsViralDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'isViral', Sort.desc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> thenByLikesCount() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'likesCount', Sort.asc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> thenByLikesCountDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'likesCount', Sort.desc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> thenBySanskrit() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'sanskrit', Sort.asc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> thenBySanskritDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'sanskrit', Sort.desc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> thenBySection() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'section', Sort.asc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> thenBySectionDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'section', Sort.desc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> thenByShlokaId() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'shlokaId', Sort.asc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> thenByShlokaIdDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'shlokaId', Sort.desc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> thenBySource() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'source', Sort.asc);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QAfterSortBy> thenBySourceDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'source', Sort.desc);
    });
  }
}

extension IsarShlokaQueryWhereDistinct
    on QueryBuilder<IsarShloka, IsarShloka, QDistinct> {
  QueryBuilder<IsarShloka, IsarShloka, QDistinct> distinctByAuthor(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'author', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QDistinct> distinctByCategory(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'category', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QDistinct> distinctByHindiMeaning(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'hindiMeaning', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QDistinct> distinctByIsViral() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'isViral');
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QDistinct> distinctByLikesCount() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'likesCount');
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QDistinct> distinctByMoodTags() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'moodTags');
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QDistinct> distinctBySanskrit(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'sanskrit', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QDistinct> distinctBySection(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'section', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QDistinct> distinctByShlokaId(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'shlokaId', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<IsarShloka, IsarShloka, QDistinct> distinctBySource(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'source', caseSensitive: caseSensitive);
    });
  }
}

extension IsarShlokaQueryProperty
    on QueryBuilder<IsarShloka, IsarShloka, QQueryProperty> {
  QueryBuilder<IsarShloka, int, QQueryOperations> idProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'id');
    });
  }

  QueryBuilder<IsarShloka, String, QQueryOperations> authorProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'author');
    });
  }

  QueryBuilder<IsarShloka, String, QQueryOperations> categoryProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'category');
    });
  }

  QueryBuilder<IsarShloka, String, QQueryOperations> hindiMeaningProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'hindiMeaning');
    });
  }

  QueryBuilder<IsarShloka, bool, QQueryOperations> isViralProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'isViral');
    });
  }

  QueryBuilder<IsarShloka, int, QQueryOperations> likesCountProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'likesCount');
    });
  }

  QueryBuilder<IsarShloka, List<String>, QQueryOperations> moodTagsProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'moodTags');
    });
  }

  QueryBuilder<IsarShloka, String?, QQueryOperations> sanskritProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'sanskrit');
    });
  }

  QueryBuilder<IsarShloka, String, QQueryOperations> sectionProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'section');
    });
  }

  QueryBuilder<IsarShloka, String, QQueryOperations> shlokaIdProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'shlokaId');
    });
  }

  QueryBuilder<IsarShloka, String, QQueryOperations> sourceProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'source');
    });
  }
}
