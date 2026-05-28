import ast
from pathlib import Path


MODULES_ROOT = Path(__file__).resolve().parents[2] / "app" / "modules"


def test_modules_do_not_import_foreign_repositories():
    violations = []

    for source_path in MODULES_ROOT.rglob("*.py"):
        source_module = source_path.relative_to(MODULES_ROOT).parts[0]
        tree = ast.parse(source_path.read_text(), filename=str(source_path))

        for node in ast.walk(tree):
            imported_module = _repository_module(node)
            if imported_module and imported_module != source_module:
                violations.append(f"{source_path.name}: {source_module} -> {imported_module}")

    assert not violations, "Repositories de outros modulos importados: " + ", ".join(violations)


def _repository_module(node):
    if isinstance(node, ast.ImportFrom):
        return _repository_from_import(node)

    if isinstance(node, ast.Import):
        return _repository_from_direct_import(node)

    return None


def _repository_from_import(node):
    if not node.module:
        return None
    if node.level >= 2 and node.module.endswith(".repository"):
        return node.module.split(".")[0]

    prefix = "app.modules."
    if node.module.startswith(prefix) and node.module.endswith(".repository"):
        return node.module.removeprefix(prefix).split(".")[0]

    return None


def _repository_from_direct_import(node):
    prefix = "app.modules."
    for alias in node.names:
        if alias.name.startswith(prefix) and alias.name.endswith(".repository"):
            return alias.name.removeprefix(prefix).split(".")[0]
    return None
