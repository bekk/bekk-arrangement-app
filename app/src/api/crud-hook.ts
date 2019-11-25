import { useState, useEffect, useCallback } from 'react';
import { get, post, put, del } from './crud';
import { Edit } from 'src/types/validation';

// TEMP
const host = 'http://localhost:5000';

interface ICrud<Key, DomainModel, WriteModel, ViewModel> {
  endpoint: (id?: Key) => string;
  fromViewModel: (viewModel: ViewModel) => [Key, Edit<DomainModel>];
  toWriteModel: (model: DomainModel) => WriteModel;
}

interface IReturn<Key, DomainModel> {
  collection: Map<Key, Edit<DomainModel>>;
  create: (model: DomainModel) => Promise<void>;
  update: (id: Key) => (model: DomainModel) => Promise<void>;
  del: (id: Key) => Promise<void>;
}

export const useCrud = <K, D, W, V>({
  endpoint,
  fromViewModel,
  toWriteModel,
}: ICrud<K, D, W, V>): IReturn<K, D> => {
  const [collection, setCollection] = useState<Map<K, Edit<D>>>(new Map());
  const path = endpoint();
  const getAll = useCallback(() => {
    get({ host, path })
      .then((xs: V[]) => xs.map(fromViewModel))
      .then(xs => new Map(xs))
      .then(setCollection);
  }, [path, fromViewModel]);
  useEffect(getAll, [getAll]);
  return {
    collection,
    create: write =>
      post({ host, path, body: toWriteModel(write) }).then(getAll),
    update: id => write =>
      put({ host, path: endpoint(id), body: toWriteModel(write) }).then(getAll),
    del: id => del({ host, path: endpoint(id) }).then(getAll),
  };
};
