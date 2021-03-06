#!/usr/bin/env bash

updateNodePackages() {
	(cd "$ROOT_DIR"/nix && {
		 node2nix -i node-packages.json -c nodepkgs.nix --nodejs-10
	})
}

version() {
	cat "$VERSION_FILE"
}

release() {
	local _level="$1"
	if [[ -z "$_level" || $_level =~ -?-?help ]]; then
		echo >&2 "Usage: release [--help | LEVEL [--force | -f]]"
		echo >&2 "  LEVEL: major, minor, patch, prerelease or stable"
		return 1
	fi

	if [[ $_level != "stable" && ! $_level =~ ^pre && $2 != "--force" && $2 != "-f" ]]; then
		_level="pre$_level"
	fi

	local branch
	local oldVersion
	local version

	branch=$(git rev-parse --abbrev-ref HEAD)
	oldVersion=$(cat "$VERSION_FILE")

	if [[ $_level =~ minor|major$ ]]; then
		[[ $branch == master ]] || {
			echo >&2 "Not on master branch, checkout 'master' to make a new release branch."
			return 1
		}

		version=$(semver -i "$_level" --preid rc "$oldVersion")

		local _branchVersion
		_branchVersion=$(semver -i "$version")
		_branchVersion=''${_branchVersion%.*}

		echo "$version" > "$VERSION_FILE"
		git commit -m "Start '$_branchVersion' release line with 'v$version'" "$VERSION_FILE"
		git tag "v$version" && {
			echo >&2 "To publish this commit as a release candidate run:"
			echo "   git push --atomic origin master master:release/$_branchVersion v$version"
			echo >&2
			echo >&2 "To patch this '$_level' release checkout the release branch:"
			echo "   git checkout release/$_branchVersion"
		}
	elif [[ $_level =~ patch|prerelease$ ]]; then
		[[ $branch =~ ^release/ ]] || {
			echo >&2 "Not on a release branch, checkout a 'release/*' or create one by: release minor|major"
			return 1
		}

		version=$(semver -i "$_level" --preid rc "$oldVersion")

		echo "$version" > "$VERSION_FILE"
		git commit -m "Bump '$_level' version to 'v$version'" "$VERSION_FILE"
		git tag "v$version" && {
			echo >&2 "To publish this commit as a release candidate run:"
			echo "   git push --atomic origin $branch v$version"
		}
	elif [[ $_level == "stable" ]]; then
		[[ $oldVersion =~ -rc\. ]] || [[ $2 == "--force" || $2 == "-f" ]] || {
			echo >&2 "Current version ($oldVersion) is not a Release Candidate. Run: release major|minor|patch"
			return 1
		}

		version=$(semver -i "$oldVersion")

		echo "$version" > "$VERSION_FILE"
		git commit -m "Release 'v$version' as 'stable'" "$VERSION_FILE"
		git tag "v$version" && {
			git tag -f stable
			echo >&2 "To publish this commit as a stable release run:"
			echo "   git push -f origin stable"
		}
	else
		echo >&2 "Unknown release level ($_level)"
		return 1
  fi
}

echo 'Locally available commands:
  * updateNodePackages'

echo '  * version'
version

echo '  * release'
release help
