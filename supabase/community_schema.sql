-- Ayer Wiki community v0.3.3. Run once in the Supabase SQL Editor.
create extension if not exists pgcrypto;
create table if not exists public.community_posts (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 author_name text not null check (char_length(author_name) between 1 and 40),
 title text not null check (char_length(title) between 2 and 70),
 body text not null check (char_length(body) between 2 and 3000),
 category text not null check (category in ('世界讨论','人物交流','创作分享','建议反馈')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.community_comments (
 id uuid primary key default gen_random_uuid(),
 post_id uuid not null references public.community_posts(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 author_name text not null check (char_length(author_name) between 1 and 40),
 body text not null check (char_length(body) between 1 and 1000),
 created_at timestamptz not null default now()
);
create table if not exists public.community_likes (
 post_id uuid not null references public.community_posts(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(),
 primary key(post_id,user_id)
);
create index if not exists community_posts_created_idx on public.community_posts(created_at desc);
create index if not exists community_comments_post_idx on public.community_comments(post_id,created_at);
create index if not exists community_likes_post_idx on public.community_likes(post_id);
alter table public.community_posts enable row level security;
alter table public.community_comments enable row level security;
alter table public.community_likes enable row level security;
grant usage on schema public to anon,authenticated;
grant select on public.community_posts,public.community_comments,public.community_likes to anon,authenticated;
grant insert,update,delete on public.community_posts to authenticated;
grant insert,delete on public.community_comments,public.community_likes to authenticated;
drop policy if exists "Public read posts" on public.community_posts;
create policy "Public read posts" on public.community_posts for select to anon,authenticated using (true);
drop policy if exists "Users create own posts" on public.community_posts;
create policy "Users create own posts" on public.community_posts for insert to authenticated with check ((select auth.uid())=user_id and (select auth.jwt()->>'is_anonymous') is distinct from 'true');
drop policy if exists "Users update own posts" on public.community_posts;
create policy "Users update own posts" on public.community_posts for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
drop policy if exists "Users delete own posts" on public.community_posts;
create policy "Users delete own posts" on public.community_posts for delete to authenticated using ((select auth.uid())=user_id);
drop policy if exists "Public read comments" on public.community_comments;
create policy "Public read comments" on public.community_comments for select to anon,authenticated using (true);
drop policy if exists "Users create own comments" on public.community_comments;
create policy "Users create own comments" on public.community_comments for insert to authenticated with check ((select auth.uid())=user_id and (select auth.jwt()->>'is_anonymous') is distinct from 'true');
drop policy if exists "Users delete own comments" on public.community_comments;
create policy "Users delete own comments" on public.community_comments for delete to authenticated using ((select auth.uid())=user_id);
drop policy if exists "Public read likes" on public.community_likes;
create policy "Public read likes" on public.community_likes for select to anon,authenticated using (true);
drop policy if exists "Users like as themselves" on public.community_likes;
create policy "Users like as themselves" on public.community_likes for insert to authenticated with check ((select auth.uid())=user_id and (select auth.jwt()->>'is_anonymous') is distinct from 'true');
drop policy if exists "Users remove own likes" on public.community_likes;
create policy "Users remove own likes" on public.community_likes for delete to authenticated using ((select auth.uid())=user_id);
